"""Build the original Night Archive foyer in an isolated Blender scene.

Run through Blender MCP or Blender's scripting workspace. Existing scenes are
never cleared or modified. The script stops if its destination scene already
contains objects so reruns cannot silently overwrite unsaved work.
"""

import math

import bpy
from mathutils import Vector


SCENE_NAME = "Night Archive Foyer"
scene = bpy.data.scenes.get(SCENE_NAME)
if scene is None:
    scene = bpy.data.scenes.new(SCENE_NAME)
elif scene.objects:
    raise RuntimeError(f"{SCENE_NAME!r} already contains objects; use a new scene name or inspect it first")

bpy.context.window.scene = scene
scene.render.engine = "BLENDER_EEVEE"
scene.render.resolution_x = 1600
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.image_settings.file_format = "PNG"
scene.render.image_settings.color_mode = "RGBA"
scene.render.image_settings.color_depth = "8"
scene.render.film_transparent = False
if scene.world is None:
    scene.world = bpy.data.worlds.new("NA Night Archive World")
scene.world.color = (0.004, 0.003, 0.002)


def material(name, color, metallic=0.0, roughness=0.7, emission=None, strength=0.0):
    result = bpy.data.materials.get("NA " + name) or bpy.data.materials.new("NA " + name)
    result.diffuse_color = (*color, 1)
    result.use_nodes = True
    bsdf = result.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = strength
    return result


materials = {
    "ink": material("Ink architecture", (0.018, 0.012, 0.009), 0.05, 0.78),
    "wall": material("Charred oak", (0.055, 0.038, 0.027), 0.0, 0.9),
    "brass": material("Oxidized brass", (0.34, 0.19, 0.06), 0.72, 0.34),
    "paper": material("Bone paper", (0.48, 0.40, 0.29), 0.0, 0.95),
    "gold": material("Listening glow", (0.35, 0.20, 0.045), 0.05, 0.5, (1.0, 0.42, 0.08), 1.5),
    "club": material("Club glow", (0.30, 0.045, 0.022), 0.05, 0.6, (0.9, 0.08, 0.025), 1.25),
    "ledger": material("Ledger glow", (0.28, 0.15, 0.07), 0.05, 0.6, (0.72, 0.28, 0.06), 1.05),
    "map": material("Archive glow", (0.05, 0.22, 0.20), 0.05, 0.55, (0.08, 0.55, 0.46), 1.2),
}


def link_to_scene(obj):
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    scene.collection.objects.link(obj)


def cube(name, location, scale, surface, bevel=0.04):
    bpy.ops.mesh.primitive_cube_add(location=location)
    obj = bpy.context.object
    obj.name = "NA " + name
    link_to_scene(obj)
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("Soft museum edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
    obj.data.materials.append(surface)
    return obj


def cylinder(name, location, radius, depth, surface, vertices=32):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=location)
    obj = bpy.context.object
    obj.name = "NA " + name
    link_to_scene(obj)
    obj.data.materials.append(surface)
    return obj


cube("Museum plinth", (0, 0, -0.35), (7.2, 5.1, 0.35), materials["ink"], 0.12)
cube("Central corridor NS", (0, 0, 0.02), (0.75, 4.7, 0.05), materials["brass"], 0.02)
cube("Central corridor EW", (0, 0, 0.025), (6.8, 0.62, 0.055), materials["brass"], 0.02)

rooms = [
    ("Listening Booth", (-3.8, 2.55), materials["gold"]),
    ("Inside the Clubs", (3.8, 2.55), materials["club"]),
    ("Keep the Room Open", (-3.8, -2.55), materials["ledger"]),
    ("City Archive", (3.8, -2.55), materials["map"]),
]
for name, (x, y), glow in rooms:
    cube(f"{name} floor", (x, y, 0.05), (2.8, 1.85, 0.08), glow, 0.04)
    cube(f"{name} back wall", (x, y + (1.78 if y > 0 else -1.78), 1.25), (2.8, 0.10, 1.25), materials["wall"], 0.03)
    outer_x = x + (-2.72 if x < 0 else 2.72)
    cube(f"{name} side wall", (outer_x, y, 1.25), (0.10, 1.78, 1.25), materials["wall"], 0.03)
    cylinder(f"{name} marker", (x, y, 0.22), 0.24, 0.16, materials["brass"], 48)

# Listening stations.
for x in (-4.7, -2.9):
    cube("Listening pedestal", (x, 2.55, 0.45), (0.45, 0.45, 0.38), materials["ink"], 0.06)
    cylinder("Listening disc", (x, 2.55, 0.86), 0.34, 0.06, materials["brass"], 48)
    cylinder("Listening center", (x, 2.55, 0.91), 0.07, 0.08, materials["gold"], 32)

# Club stage and tables.
cube("Club stage", (4.25, 3.05, 0.32), (2.05, 0.72, 0.22), materials["wall"], 0.08)
cube("Piano silhouette", (4.6, 3.15, 0.72), (0.75, 0.30, 0.25), materials["ink"], 0.08)
for dx, dy, radius in [(-0.65, 0.1, 0.25), (-0.2, 0.2, 0.18), (-0.35, -0.22, 0.16)]:
    cylinder("Drum silhouette", (3.55 + dx, 3.05 + dy, 0.7), radius, 0.18, materials["brass"], 32)
for x, y in [(2.5, 1.7), (4.0, 1.65), (5.35, 1.8)]:
    cylinder("Club table", (x, y, 0.42), 0.32, 0.07, materials["paper"], 32)
    cylinder("Club table stem", (x, y, 0.22), 0.06, 0.4, materials["brass"], 20)

# Ledger room.
cube("Ledger desk", (-3.8, -2.3, 0.55), (1.65, 0.7, 0.45), materials["wall"], 0.08)
for index in range(4):
    sheet = cube(
        f"Ledger sheet {index + 1}",
        (-4.75 + index * 0.62, -2.17 + (index % 2) * 0.06, 1.04 + index * 0.012),
        (0.25, 0.38, 0.015), materials["paper"], 0.015,
    )
    sheet.rotation_euler[2] = math.radians((-4, 3, -2, 5)[index])
for index, x in enumerate((-5.1, -4.2, -3.3, -2.4)):
    cylinder(f"Decision weight {index + 1}", (x, -3.45, 0.34), 0.20, 0.55, materials["brass"], 24)

# Archive map table.
cube("Archive map table", (3.8, -2.55, 0.58), (1.72, 1.0, 0.48), materials["wall"], 0.07)
cube("Archive map surface", (3.8, -2.55, 1.075), (1.58, 0.88, 0.018), materials["map"], 0.015)
for index in range(5):
    cube(f"Archive drawer {index + 1}", (5.55, -3.55 + index * 0.42, 0.55), (0.5, 0.16, 0.28), materials["paper"], 0.025)


def point_at(obj, target):
    direction = Vector(target) - obj.location
    obj.rotation_euler = direction.to_track_quat("-Z", "Y").to_euler()


bpy.ops.object.camera_add(location=(12.5, -14.5, 13.2))
camera = bpy.context.object
camera.name = "NA Night Archive Camera"
link_to_scene(camera)
camera.data.type = "ORTHO"
camera.data.ortho_scale = 18.2
point_at(camera, (0, 0, 0.4))
scene.camera = camera

for name, location, energy, size, color, target in [
    ("Warm house light", (-5, -4, 12), 1150, 8, (1.0, 0.55, 0.28), (0, 0, 0)),
    ("Cool archive fill", (7, 6, 8), 650, 7, (0.22, 0.38, 0.42), (1, 0, 0)),
]:
    bpy.ops.object.light_add(type="AREA", location=location)
    light = bpy.context.object
    light.name = "NA " + name
    link_to_scene(light)
    light.data.energy = energy
    light.data.shape = "DISK"
    light.data.size = size
    light.data.color = color
    point_at(light, target)

bpy.ops.object.light_add(type="POINT", location=(0, 0, 3.5))
corridor_light = bpy.context.object
corridor_light.name = "NA Corridor lamp"
link_to_scene(corridor_light)
corridor_light.data.energy = 420
corridor_light.data.color = (1.0, 0.35, 0.12)
corridor_light.data.shadow_soft_size = 2.0

scene.view_settings.look = "AgX - Medium High Contrast"
