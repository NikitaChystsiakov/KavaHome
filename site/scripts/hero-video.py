# Монтаж видео первого экрана (2026-11-19): исходники из «Видео/» (в git не входят), результат — site/public/video/.
# Запуск: симлинки R/MB/V/RW/RC/RL.mov в src/, затем python3 hero-video.py wide|tall; после — пережать до 1600x900 crf 31 (tall: crf 31).
import subprocess, sys
S="/private/tmp/claude-501/-Users-nikita-Desktop---------KavaHome/475ed2aa-e045-41d4-bf32-9557d22cc8e0/scratchpad"
SRC=S+"/src/"
L=6.0; X=0.8; STEP=L-X
def build(name, scenes, W, H, panels, crf):
    # scenes: list of lists of (file,start) ; panels: n panels
    gap=3 if panels==3 else 0
    pw=(W-gap*(panels-1))//panels
    inputs=[]; fc=[]
    for si,sc in enumerate(scenes):
        labels=[]
        for pi,(f,t) in enumerate(sc):
            idx=len(inputs)//6
            inputs += ["-ss",str(t),"-t",str(L+0.1),"-i",SRC+f]
            fc.append(f"[{idx}:v]fps=30,scale={pw}:{H}:force_original_aspect_ratio=increase,crop={pw}:{H},setsar=1,setpts=PTS-STARTPTS[p{si}_{pi}]")
            labels.append(f"p{si}_{pi}")
        if panels==1:
            fc.append(f"[{labels[0]}]format=yuv420p,trim=duration={L},setpts=PTS-STARTPTS[s{si}]")
        else:
            fc.append(f"color=c=0xFBF8F3:s={W}x{H}:r=30:d={L}[c{si}]")
            prev=f"c{si}"
            for pi,l in enumerate(labels):
                x=pi*(pw+gap)
                fc.append(f"[{prev}][{l}]overlay={x}:0:shortest=1[o{si}_{pi}]")
                prev=f"o{si}_{pi}"
            fc.append(f"[{prev}]format=yuv420p,trim=duration={L},setpts=PTS-STARTPTS[s{si}]")
    n=len(scenes)
    cur="s0"
    for i in range(1,n):
        off=round(STEP*i,3)
        fc.append(f"[{cur}][s{i}]xfade=transition=fade:duration={X}:offset={off}[x{i}]")
        cur=f"x{i}"
    total=STEP*(n-1)+X
    start=X; end=STEP*(n-1)+X  # s_last source 0.8 reached at STEP*(n-1)+X
    fc.append(f"[{cur}]trim=start={start}:end={end},setpts=PTS-STARTPTS[v]")
    out=f"{S}/out/{name}.mp4"
    cmd=["ffmpeg","-v","error","-y"]+inputs+["-filter_complex",";".join(fc),"-map","[v]","-an",
      "-c:v","libx264","-preset","slow","-crf",str(crf),"-profile:v","high","-pix_fmt","yuv420p","-movflags","+faststart",out]
    subprocess.run(cmd,check=True)
    print(out)

wide=[
 [("R.mov",0),("MB.mov",0),("V.mov",0)],
 [("R.mov",12),("MB.mov",14.5),("V.mov",10)],
 [("RW.mov",1),("RC.mov",0),("RL.mov",0)],
 [("R.mov",21.5),("MB.mov",21.5),("V.mov",20)],
]
wide.append(wide[0])
tall=[
 [("R.mov",0)],[("MB.mov",14.5)],[("RL.mov",0)],[("V.mov",20)],[("R.mov",0)],
]
which=sys.argv[1]
if which=="wide": build("hero-wide",wide,1920,1080,3,28)
else: build("hero-tall",tall,720,1280,1,27)
