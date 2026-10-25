"""Generate exercise-specific 3D demonstrative videos for Treino C.
These are stylized, instructional 3D mannequins, not live-action fitness videos.
Run with xvfb-run -a python scripts/generate_treino_c.py.
"""
import math
import os
import subprocess
from pathlib import Path
import numpy as np
import vtk
from PIL import Image
from vtk.util.numpy_support import vtk_to_numpy

OUT = Path("assets/videos")
OUT.mkdir(parents=True, exist_ok=True)
W, H = 640, 360
SKIN = (.77, .63, .50)
SHIRT = (.27, .41, .39)
SHORTS = (.22, .24, .27)
LINKS = {}

def ease(v):
    v = max(0, min(1, v))
    return .5 - .5 * math.cos(math.pi * v)

def mix(a, b, t):
    return tuple(np.array(a)*(1-t) + np.array(b)*t)

def ramp(t, a, b):
    return ease((t-a)/(b-a))

def ball(color, resolution=18):
    src = vtk.vtkSphereSource()
    src.SetThetaResolution(resolution)
    src.SetPhiResolution(resolution)
    src.SetRadius(1)
    actor = vtk.vtkActor()
    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputConnection(src.GetOutputPort())
    actor.SetMapper(mapper)
    actor.GetProperty().SetColor(*color)
    actor.GetProperty().SetSpecular(.14)
    return actor

def link(color):
    line = vtk.vtkLineSource()
    line.SetPoint1(0,0,0); line.SetPoint2(0,0,1)
    tube = vtk.vtkTubeFilter()
    tube.SetInputConnection(line.GetOutputPort())
    tube.SetRadius(.12)
    tube.SetNumberOfSides(16)
    tube.CappingOn()
    actor = vtk.vtkActor()
    mapper = vtk.vtkPolyDataMapper()
    mapper.SetInputConnection(tube.GetOutputPort())
    actor.SetMapper(mapper)
    actor.GetProperty().SetColor(*color)
    LINKS[id(actor)] = (line,tube)
    return actor

def pball(actor, p, scale):
    actor.SetPosition(*p)
    actor.SetScale(*scale)

def plink(actor, start, end, radius):
    line,tube = LINKS[id(actor)]
    line.SetPoint1(*start)
    line.SetPoint2(*end)
    tube.SetRadius(radius)

class Athlete:
    def __init__(self, ren):
        self.lines={}
        self.balls={}
        for label,color in {
            'spine':SHIRT,'pelvis':SHORTS,'neck':SKIN,
            'upperleft':SKIN,'lowleft':SKIN,'upperright':SKIN,'lowright':SKIN,
            'thighleft':SKIN,'shincleft':SKIN,'thighright':SKIN,'shincright':SKIN
        }.items():
            self.lines[label]=link(color)
            ren.AddActor(self.lines[label])
        for label,color in {
            'head':SKIN,'shoulderleft':SKIN,'shoulderright':SKIN,
            'elbowleft':SKIN,'elbowright':SKIN,'kneele':SKIN,'kneeri':SKIN,
            'hipl':SHORTS,'hipr':SHORTS,'rib':SHIRT,'handL':SKIN,'handR':SKIN
        }.items():
            self.balls[label]=ball(color)
            ren.AddActor(self.balls[label])
        self.hair=ball((.13,.14,.16));ren.AddActor(self.hair)

    def set_plank(self,t):
        bounce=.012*math.sin(2*math.pi*t)
        hip=(-.59,0,.80+bounce)
        neck=(.78,0,.74+bounce)
        head=(1.01,0,.76+bounce)
        plink(self.lines['spine'],hip,neck,.33)
        plink(self.lines['pelvis'],(-.68,-.31,.79+bounce),(-.68,.31,.79+bounce),.30)
        plink(self.lines['neck'],neck,head,.12)
        pball(self.balls['rib'],(.25,0,.75+bounce),(.41,.29,.22))
        pball(self.balls['head'],head,(.18,.17,.23))
        pball(self.hair,(head[0]-.035,0,head[2]+.17),(.16,.16,.08))
        for lr,y in [('left',-.37),('right',.37)]:
            shoulder=(.49,y,.73+bounce)
            elbow=(.74,y,.18)
            hand=(1.10,y,.13)
            plink(self.lines['upper'+lr],shoulder,elbow,.14)
            plink(self.lines['low'+lr],elbow,hand,.105)
            pball(self.balls['shoulder'+lr],shoulder,(.15,.15,.16))
            pball(self.balls['elbow'+lr],elbow,(.105,.11,.10))
            pball(self.balls['handL' if lr=='left' else 'handR'],hand,(.10,.12,.06))
            h=(-.68,y*.74,.77+bounce)
            knee=(-1.20,y*.72,.49)
            foot=(-1.62,y*.65,.14)
            plink(self.lines['thigh'+lr],h,knee,.19)
            plink(self.lines['shinc'+lr],knee,foot,.13)
            pball(self.balls['hipl' if lr=='left' else 'hipr'],h,(.17,.15,.17))
            pball(self.balls['kneele' if lr=='left' else 'kneeri'],knee,(.12,.12,.11))

    def set_pose(self,motion,t):
        if motion=='plank':
            self.set_plank(t);return
        stretch=0;rotation=None;thread=None
        if motion=='reach':
            stretch=.5-.5*math.cos(2*math.pi*t)
        elif motion=='rotation':
            rotation=.5-.5*math.cos(2*math.pi*t)
        elif motion=='thread':
            if t<.22:thread=-ramp(t,0,.22)
            elif t<.42:thread=-1+ramp(t,.22,.42)
            elif t<.70:thread=ramp(t,.42,.70)
            else:thread=1-ramp(t,.70,1)
        pelvis=(-.62-stretch*.49,0,.95-.19*stretch)
        chest=(.33-stretch*.28,0,1.02-.53*stretch)
        neck=(.72-stretch*.31,0,1.05-.59*stretch)
        head=(.95-stretch*.37,0,1.14-.59*stretch)
        plink(self.lines['spine'],pelvis,neck,.35)
        plink(self.lines['pelvis'],(-.72-stretch*.49,-.35,pelvis[2]),(-.72-stretch*.49,.35,pelvis[2]),.37)
        plink(self.lines['neck'],neck,head,.16)
        pball(self.balls['head'],head,(.21,.19,.27))
        pball(self.hair,(head[0]-.05,head[1],head[2]+.185),(.175,.175,.10))
        pball(self.balls['rib'],chest,(.47,.30,.25))
        for side,y in [('left',-.38),('right',.38)]:
            knee=(-.57,y*.77,.15)
            hip=(-.57-stretch*.45,y*.72,pelvis[2])
            toe=(-1.1,y*.77,.115)
            pball(self.balls['kneele' if side=='left' else 'kneeri'],knee,(.145,.15,.115))
            pball(self.balls['hipl' if side=='left' else 'hipr'],hip,(.21,.18,.20))
            plink(self.lines['thigh'+side],knee,hip,.23)
            plink(self.lines['shinc'+side],knee,toe,.14)
        for side,y in [('left',-.40),('right',.40)]:
            shoulder=(.46-stretch*.26,y,1.035-stretch*.48)
            elbow=(.64-stretch*.12,y,.55-stretch*.20)
            hand=(.80+stretch*.15,y,.15)
            if side=='left' and rotation is not None:
                elbow=(.40,-.17-.63*ramp(rotation,0,1),.43+.82*ramp(rotation,0,1))
                hand=(head[0]-.16,head[1]-.16,head[2]+.02)
            if side=='left' and thread is not None:
                amount=(thread+1)*.5
                elbow=mix((.25,.02,.29),(.50,-.71,1.12),amount)
                hand=mix((.37,.66,.24),(.50,-1.03,1.62),amount)
            if stretch>0:
                elbow=(.67+stretch*.03,y,.53-stretch*.28)
                hand=(.82+stretch*.40,y,.15)
            plink(self.lines['upper'+side],shoulder,elbow,.145)
            plink(self.lines['low'+side],elbow,hand,.112)
            pball(self.balls['shoulder'+side],shoulder,(.175,.18,.19))
            pball(self.balls['elbow'+side],elbow,(.118,.13,.115))
            pball(self.balls['handL' if side=='left' else 'handR'],hand,(.12,.17,.067))

ren=vtk.vtkRenderer()
ren.SetBackground(.982,.988,.985)
window=vtk.vtkRenderWindow()
window.SetOffScreenRendering(1)
window.AddRenderer(ren)
window.SetSize(W,H)
window.SetMultiSamples(0)
mat=vtk.vtkCubeSource()
mat.SetXLength(3.3);mat.SetYLength(1.9);mat.SetZLength(.045)
mapper=vtk.vtkPolyDataMapper()
mapper.SetInputConnection(mat.GetOutputPort())
actor=vtk.vtkActor();actor.SetMapper(mapper)
actor.SetPosition(-.1,0,.057)
actor.GetProperty().SetColor(.39,.57,.46)
ren.AddActor(actor)
floor=vtk.vtkCubeSource()
floor.SetXLength(60);floor.SetYLength(60);floor.SetZLength(.05)
mapper=vtk.vtkPolyDataMapper()
mapper.SetInputConnection(floor.GetOutputPort())
flooractor=vtk.vtkActor();flooractor.SetMapper(mapper)
flooractor.SetPosition(0,0,-.04)
flooractor.GetProperty().SetColor(.93,.94,.92)
ren.AddActor(flooractor)
light=vtk.vtkLight();light.SetPosition(1,-5,8);light.SetIntensity(.87);ren.AddLight(light)
fill=vtk.vtkLight();fill.SetPosition(-4,4,7);fill.SetIntensity(.45);ren.AddLight(fill)
athlete=Athlete(ren)
cam=ren.GetActiveCamera()
cam.SetPosition(3.4,-5.5,2.5)
cam.SetFocalPoint(-.1,0,.63)
cam.SetViewUp(0,0,1)
cam.SetParallelProjection(1)
cam.SetParallelScale(1.67)
window.Render()

def frame(name,step):
    athlete.set_pose(name,step)
    window.Render()
    writer=vtk.vtkWindowToImageFilter()
    writer.SetInput(window)
    writer.SetInputBufferTypeToRGB()
    writer.ReadFrontBufferOff()
    writer.Update()
    arr=vtk_to_numpy(writer.GetOutput().GetPointData().GetScalars()).reshape(H,W,3)
    return Image.fromarray(np.flipud(arr)).convert('RGB')

for output,motion in [
    ('C_rotacao_quatro_apoios','rotation'),
    ('C_braco_por_baixo','thread'),
    ('C_alcance_costas_ombros','reach'),
    ('C_prancha_antebracos','plank')
]:
    from tempfile import TemporaryDirectory
    with TemporaryDirectory() as temp:
        for index in range(32):
            frame(motion,index/32).save(os.path.join(temp,f"{index:04d}.png"))
        subprocess.run([
            "ffmpeg","-hide_banner","-loglevel","error","-y",
            "-framerate","12","-i",os.path.join(temp,"%04d.png"),
            "-vf","format=yuv420p","-c:v","libx264","-preset","fast",
            "-crf","30","-movflags","+faststart",str(OUT/(output+".mp4"))
        ],check=True)
    print("created",str(OUT/(output+".mp4")),flush=True)
