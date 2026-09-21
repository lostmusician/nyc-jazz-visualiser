"""Original illustrative memory street. Run inside Blender; creates an isolated scene.
Six transparent layers share an orthographic camera for browser compositing.
"""
import bpy
import math
import random
from pathlib import Path

ROOT = Path('/Users/ivanchiew/Documents/GitHub/nyc-jazz-visualiser')
OUT = ROOT / 'public/art/street'
OUT.mkdir(parents=True, exist_ok=True)
scene = bpy.data.scenes.new('A Night Remembered Street')
bpy.context.window.scene = scene
scene.render.engine = 'CYCLES'
scene.cycles.samples = 8
scene.render.resolution_x = 1600
scene.render.resolution_y = 1000
scene.render.resolution_percentage = 100
scene.render.film_transparent = True
scene.render.image_settings.file_format = 'PNG'
scene.render.image_settings.color_mode = 'RGBA'
scene.world = bpy.data.worlds.new('Remembered charcoal air')
scene.world.color = (.12,.12,.12)
scene.view_settings.view_transform = 'Standard'
layers = {name: [] for name in ['far','middle','foreground','door-light','hand','ticket']}
random.seed(1947)

def material(name, color):
    m = bpy.data.materials.new(name)
    m.diffuse_color = (*color, 1)
    m.use_nodes = True
    bs = m.node_tree.nodes.get('Principled BSDF')
    bs.inputs['Base Color'].default_value = (*color,1)
    bs.inputs['Emission Color'].default_value = (*color,1)
    bs.inputs['Emission Strength'].default_value = .8
    return m

ink = material('Charcoal',(.075,.068,.065))
far = material('Distant graphite',(.19,.18,.18))
stone = material('Remembered brick',(.12,.105,.095))
light = material('Door amber',(.8,.47,.19))
window = material('Window paper',(.39,.32,.23))
skin = material('Hand sepia',(.30,.225,.16))
paper = material('Worn admission paper',(.65,.51,.31))

def cube(name, loc, scale, mat, layer):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale
    o.data.materials.append(mat); layers[layer].append(o)
    return o

def sphere(name, loc, scale, mat, layer):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=16, ring_count=8, location=loc)
    o=bpy.context.object; o.name=name; o.scale=scale
    o.data.materials.append(mat); layers[layer].append(o)
    return o

for i in range(20):
    x=-12+i*1.25; h=random.uniform(3.5,8)
    cube('Distant tenement', (x,3,h/2-1),(1.15,.3,h),far,'far')
    for z in range(1,int(h)):
        for dx in [-.3,.3]:
            if random.random()>.35: cube('Far window',(x+dx,2.8,z-1),(.13,.03,.25),window,'far')
for side in [-1,1]:
    for i in range(3):
        x=side*(5.1+i*2.5); h=7+i
        cube('Street facade',(x,1,h/2-1),(2.3,.5,h),stone,'middle')
        for z in range(1,6):
            for dx in [-.6,0,.6]: cube('Sash window',(x+dx,.7,z),(.3,.04,.55),ink,'middle')
        for z in [2,4]: cube('Fire escape',(x,.4,z),(2.4,.12,.07),window,'middle')
    cube('Street lamp',(side*3.7,-.2,2),(.06,.06,5.8),ink,'foreground')
    sphere('Lamp halo',(side*3.7,-.25,4.8),(.22,.07,.17),light,'foreground')
    for j in range(3):
        x=side*(2.6+j*2.4); size=.65+j*.2
        sphere('Passing head',(x,-.8,size*1.3),(.16*size,.13,.21*size),ink,'foreground')
        sphere('Passing overcoat',(x,-.8,size*.5),(.26*size,.12,.65*size),ink,'foreground')
        cube('Instrument case',(x+.35,-.85,size*.3),(.17,.1,.7*size),ink,'foreground')
cube('Door surround',(0,.1,1.05),(2.25,.35,4.1),stone,'door-light')
cube('Door light',(0,-.12,1.05),(1.55,.05,3.45),light,'door-light')
cube('Door inner darkness',(-.24,-.2,1),(1.03,.05,3.35),ink,'door-light')
cube('Door lintel',(0,-.2,3.1),(2.5,.08,.13),window,'door-light')
cube('Coat sleeve',(3.25,-1,-1.25),(2.3,.2,.7),ink,'hand').rotation_euler[1]=-.3
sphere('Older visitor palm',(1.9,-1.15,-.7),(.67,.18,.3),skin,'hand')
for i in range(4):
    finger=sphere('Finger',(1.55+i*.15,-1.25,-.35),(.09,.08,.32),skin,'hand')
    finger.rotation_euler[1]=-.15
    for crease in [0,.12]: cube('Finger crease',(1.55+i*.15,-1.34,-.38+crease),(.1,.008,.012),ink,'hand')
cube('Admission stub',(1.5,-1.4,.0),(1.55,.04,.8),paper,'ticket').rotation_euler[1]=-.12
for i in range(8): sphere('Ticket perforation',(2.05,-1.45,-.32+i*.09),(.016,.01,.018),ink,'ticket')
for z in [-.18,.0,.18]: cube('Ticket ink rule',(1.38,-1.45,z),(.78,.01,.015),ink,'ticket')

camera_data=bpy.data.cameras.new('Remembered street camera')
camera=bpy.data.objects.new('Remembered street camera',camera_data)
scene.collection.objects.link(camera); camera.location=(0,-25,3)
camera.rotation_euler=(math.pi/2,0,0)
camera_data.type='ORTHO'; camera_data.ortho_scale=20
scene.camera=camera
for name, objects in layers.items():
    for key, group in layers.items():
        for obj in group: obj.hide_render=key != name
    scene.render.filepath=str(OUT / (name+'.png'))
    bpy.ops.render.render(write_still=True)
for group in layers.values():
    for obj in group: obj.hide_render=False
bpy.ops.wm.save_as_mainfile(filepath=str(ROOT/'art/blender/a_night_remembered_street.blend'),copy=True)
print('Six original memory-street layers rendered.')
