"""Render four original Night Archive room tableaux without altering existing scenes."""

import os
import math

import bpy
from mathutils import Vector


ROOT = "/Users/ivanchiew/Documents/GitHub/nyc-jazz-visualiser"
OUTPUT = os.path.join(ROOT, "public/art/rooms")
SOURCE = os.path.join(ROOT, "art/blender/night_archive_rooms.blend")
os.makedirs(OUTPUT, exist_ok=True)
os.makedirs(os.path.dirname(SOURCE), exist_ok=True)


def make_material(name, color, metallic=0.0, roughness=0.75, emission=None, strength=0.0):
    key = "NAR " + name
    result = bpy.data.materials.get(key) or bpy.data.materials.new(key)
    result.use_nodes = True
    bsdf = result.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metallic
    bsdf.inputs["Roughness"].default_value = roughness
    if emission:
        bsdf.inputs["Emission Color"].default_value = (*emission, 1)
        bsdf.inputs["Emission Strength"].default_value = strength
    return result


M = {
    "ink": make_material("Blackened wood", (0.015, 0.009, 0.007), 0.05, 0.82),
    "wall": make_material("Brown plaster", (0.055, 0.032, 0.020), 0.0, 0.95),
    "brass": make_material("Oxidized brass", (0.31, 0.16, 0.045), 0.72, 0.32),
    "paper": make_material("Bone paper", (0.56, 0.46, 0.33), 0.0, 0.97),
    "red": make_material("Curtain red", (0.22, 0.018, 0.012), 0.0, 0.78),
    "gold": make_material("Listening amber", (0.30, 0.12, 0.025), 0.1, 0.48, (1.0, 0.30, 0.045), 1.1),
    "orange": make_material("Club ember", (0.27, 0.035, 0.013), 0.05, 0.55, (0.85, 0.07, 0.02), 0.9),
    "cyan": make_material("Map glass", (0.035, 0.18, 0.17), 0.15, 0.42, (0.055, 0.55, 0.47), 1.05),
    "green": make_material("Surplus green", (0.035, 0.19, 0.09), 0.1, 0.5, (0.05, 0.55, 0.19), 0.6),
}


def point_at(obj, target=(0, 0, 1.3)):
    obj.rotation_euler = (Vector(target) - obj.location).to_track_quat("-Z", "Y").to_euler()


def create_scene(name):
    scene = bpy.data.scenes.get(name)
    if scene is None:
        scene = bpy.data.scenes.new(name)
    elif scene.objects:
        raise RuntimeError(f"{name!r} already contains objects; refusing to overwrite it")
    bpy.context.window.scene = scene
    scene.render.engine = "BLENDER_EEVEE"
    scene.render.resolution_x = 1400
    scene.render.resolution_y = 900
    scene.render.resolution_percentage = 100
    scene.render.image_settings.file_format = "PNG"
    scene.render.image_settings.color_mode = "RGBA"
    scene.render.image_settings.color_depth = "8"
    scene.render.film_transparent = False
    scene.world = bpy.data.worlds.get("NAR World") or bpy.data.worlds.new("NAR World")
    scene.world.color = (0.003, 0.002, 0.001)
    scene.view_settings.look = "AgX - Medium High Contrast"
    return scene


def link(scene, obj):
    for collection in list(obj.users_collection):
        collection.objects.unlink(obj)
    scene.collection.objects.link(obj)


def cube(scene, name, loc, scale, surface, bevel=0.05, rotation=0):
    bpy.ops.mesh.primitive_cube_add(location=loc, rotation=(0, 0, rotation))
    obj = bpy.context.object
    obj.name = name
    link(scene, obj)
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if bevel:
        modifier = obj.modifiers.new("Soft edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
    obj.data.materials.append(surface)
    return obj


def cylinder(scene, name, loc, radius, depth, surface, vertices=40, rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=radius, depth=depth, location=loc, rotation=rotation)
    obj = bpy.context.object
    obj.name = name
    link(scene, obj)
    obj.data.materials.append(surface)
    return obj


def sphere(scene, name, loc, scale, surface):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, location=loc)
    obj = bpy.context.object
    obj.name = name
    link(scene, obj)
    obj.scale = scale
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    obj.data.materials.append(surface)
    return obj


def stage_scene(name, accent, camera=(10, -13, 8.5)):
    scene = create_scene(name)
    cube(scene, name + " floor", (0, 0, -0.18), (6.8, 4.4, 0.18), M["ink"], 0.12)
    cube(scene, name + " back wall", (0, 4.15, 2.7), (6.8, 0.12, 2.7), M["wall"], 0.05)
    cube(scene, name + " side wall", (-6.65, 0, 2.7), (0.12, 4.15, 2.7), M["wall"], 0.05)
    cube(scene, name + " light rug", (0, 0.2, 0.02), (4.9, 3.1, 0.025), accent, 0.03)

    bpy.ops.object.camera_add(location=camera)
    cam = bpy.context.object
    cam.name = name + " Camera"
    link(scene, cam)
    cam.data.type = "ORTHO"
    cam.data.ortho_scale = 14.6
    point_at(cam)
    scene.camera = cam

    for light_name, light_type, loc, energy, size, color, target in [
        ("Warm key", "AREA", (-4, -4, 10), 950, 7, (1.0, 0.44, 0.22), (0, 0, 0)),
        ("Cool rim", "AREA", (6, 4, 7), 470, 5, (0.19, 0.34, 0.40), (0, 1, 1)),
    ]:
        bpy.ops.object.light_add(type=light_type, location=loc)
        light = bpy.context.object
        light.name = name + " " + light_name
        link(scene, light)
        light.data.energy = energy
        light.data.size = size
        light.data.color = color
        point_at(light, target)
    return scene


def render(scene, filename):
    bpy.context.window.scene = scene
    scene.render.filepath = os.path.join(OUTPUT, filename)
    bpy.ops.render.render(write_still=True)


# Listening Booth: paired listening objects divided by a quiet central seam.
listening = stage_scene("Night Archive Listening", M["gold"])
cube(listening, "Listening divider", (0, 2.4, 2.25), (0.05, 1.65, 2.05), M["brass"], 0.02)
for index, x in enumerate((-2.35, 2.35), 1):
    cube(listening, f"Listening pedestal {index}", (x, 0.4, 0.65), (0.9, 0.9, 0.65), M["ink"], 0.12)
    cylinder(listening, f"Listening record {index}", (x, 0.4, 1.34), 0.68, 0.07, M["brass"], 64)
    cylinder(listening, f"Listening spindle {index}", (x, 0.4, 1.43), 0.10, 0.12, M["gold"], 40)
    cylinder(listening, f"Speaker body {index}", (x, 2.5, 2.15), 0.72, 0.7, M["ink"], 48, (math.radians(90), 0, 0))
    cylinder(listening, f"Speaker cone {index}", (x, 2.08, 2.15), 0.46, 0.05, M["gold"], 48, (math.radians(90), 0, 0))
render(listening, "listening-room.png")

# Club room: a small stage held in a large field of darkness.
clubs = stage_scene("Night Archive Clubs", M["orange"])
for x in (-4.8, 4.8):
    cube(clubs, "Curtain panel", (x, 3.75, 2.5), (1.5, 0.18, 2.4), M["red"], 0.08)
cube(clubs, "Club stage", (0, 2.25, 0.45), (4.2, 1.15, 0.42), M["wall"], 0.1)
cube(clubs, "Piano", (1.65, 2.35, 1.18), (1.1, 0.58, 0.42), M["ink"], 0.12)
for x, y, radius in [(-1.5, 2.4, 0.52), (-0.75, 2.55, 0.32), (-1.15, 1.9, 0.30)]:
    cylinder(clubs, "Drum", (x, y, 1.25), radius, 0.25, M["brass"], 40)
for x, y in [(-3.5, -0.5), (-1.2, -1.2), (1.2, -1.1), (3.5, -0.4)]:
    cylinder(clubs, "Audience table", (x, y, 0.52), 0.52, 0.09, M["paper"], 40)
    cylinder(clubs, "Audience table stem", (x, y, 0.27), 0.07, 0.48, M["brass"], 24)
render(clubs, "clubs-room.png")

# Economics: the room is reduced to a desk, four weights and an unstable balance.
economics = stage_scene("Night Archive Economics", M["gold"])
cube(economics, "Ledger desk", (0, 0.55, 0.78), (3.5, 1.35, 0.7), M["wall"], 0.12)
for index in range(7):
    cube(economics, f"Ledger sheet {index}", (-2.35 + index * 0.74, 0.15 + (index % 2) * 0.18, 1.52 + index * 0.012), (0.30, 0.46, 0.018), M["paper"], 0.015, math.radians((-5 + index * 2)))
for index, x in enumerate((-3.6, -1.2, 1.2, 3.6), 1):
    cylinder(economics, f"Decision weight {index}", (x, -1.75, 0.52), 0.34, 0.9, M["brass"], 32)
cube(economics, "Balance beam", (0, 2.35, 2.7), (2.5, 0.12, 0.12), M["brass"], 0.03, math.radians(-7))
sphere(economics, "Balance pivot", (0, 2.35, 2.15), (0.28, 0.28, 0.28), M["gold"])
render(economics, "economics-room.png")

# Archive: a luminous map table surrounded by drawers and encountered objects.
archive = stage_scene("Night Archive Map", M["cyan"])
cube(archive, "Archive table", (0, 0.45, 0.72), (3.8, 2.1, 0.68), M["wall"], 0.14)
cube(archive, "Archive map glass", (0, 0.45, 1.43), (3.5, 1.8, 0.035), M["cyan"], 0.025)
for index, (x, y) in enumerate([(-2.1, 0.2), (-0.7, 1.1), (0.65, -0.5), (2.1, 0.75)], 1):
    cylinder(archive, f"Venue pin {index}", (x, y, 1.62), 0.12, 0.30, M["gold"], 32)
for row in range(3):
    for col in range(4):
        cube(archive, f"Archive drawer {row}-{col}", (-5.35, -2.45 + col * 1.45, 0.5 + row * 0.72), (0.62, 0.58, 0.28), M["paper"], 0.04)
render(archive, "archive-room.png")


if os.path.exists(SOURCE):
    raise RuntimeError("Refusing to overwrite existing Blender source: " + SOURCE)
scenes = {listening, clubs, economics, archive}
blocks = set(scenes)
for scene in scenes:
    blocks.update(scene.objects)
    blocks.update(obj.data for obj in scene.objects if getattr(obj, "data", None))
    blocks.update(mat for obj in scene.objects for mat in getattr(obj.data, "materials", []) if mat)
    if scene.world:
        blocks.add(scene.world)
bpy.data.libraries.write(SOURCE, blocks, fake_user=True)
print("Rendered Night Archive room scenes to", OUTPUT)
