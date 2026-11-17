import {surface,panel,read,persist,wrap,type Frame,type Key} from "@shared/surface";

// Each number identifies the upper lane of a pair of adjacent tracks.
// A crossed point swaps the trains passing through that pair.
const yards=[
 {points:[0,1],goal:"BAC"},{points:[1,0],goal:"ACB"},{points:[0,1,0],goal:"BCA"},
 {points:[1,0,1],goal:"CAB"},{points:[0,1,0],goal:"CBA"},{points:[1,0,1,0],goal:"BCA"},
 {points:[0,1,1,0],goal:"CAB"},{points:[1,0,1,0,1],goal:"CBA"}
];
let level=read("level",0), records=read<number[]>("records",[]);
let selected=0, switches=0, moves=0, playing=false, result="", column=0, trains="ABC".split("");
let timer:ReturnType<typeof setInterval>|undefined;
function reset(){selected=0;switches=0;moves=0;playing=false;result="";column=0;trains=["A","B","C"];}
function stop(){if(timer!==undefined)clearInterval(timer);timer=undefined;}
function advance(){
 const yard=yards[level];
 if(column<yard.points.length){
   const lane=yard.points[column];
   if(switches&(1<<column)){const t=trains[lane];trains[lane]=trains[lane+1];trains[lane+1]=t;}
   column++;
 }else{
   stop();playing=false;const pass=trains.join("")===yard.goal;result=pass?"Arrived!":"Wrong platform";
   if(pass){records[level]=Math.min(records[level]||999,moves);persist("records",records);}
   console.log("dispatch",level+1,trains.join(""),yard.goal,result,moves);
 }
 refresh();
}
function input(k:Key){
 if(playing)return;
 if(result==="Arrived!"&&(k==="start"||k==="ok")){level=wrap(level+1,yards.length);persist("level",level);reset();return;}
 if(k==="hold-start"){reset();return;}
 if(result){result="";trains=["A","B","C"];column=0;}
 const yard=yards[level];
 if(k==="up"||k==="down")selected=wrap(selected+(k==="up"?1:-1),yard.points.length);
 if(k==="ok"){switches^=1<<selected;moves++;}
 if(k==="start"){playing=true;column=0;trains=["A","B","C"];timer=setInterval(advance,330);}
}
function draw():Frame{
 const yard=yards[level], image:string[][]=[];
 for(let y=0;y<16;y++)image.push(Array(72).fill("."));
 const rows=[3,8,13], color:Record<string,string>={A:"r",B:"g",C:"b"};
 for(const y of rows)for(let x=1;x<71;x++)image[y][x]="t";
 const span=54/yard.points.length;
 yard.points.forEach((pair,i)=>{
   const cx=Math.round(8+(i+0.5)*span), y=rows[pair], shade=i===selected?"w":"s";
   if(switches&(1<<i)){for(let k=0;k<=5;k++){image[y+k][cx-2+k]=shade;image[y+5-k][cx-2+k]=shade;}}
   else{for(let k=-2;k<=2;k++){image[y][cx+k]=shade;image[y+5][cx+k]=shade;}}
   if(i===selected){image[0][cx]="w";image[1][cx]="w";}
 });
 for(let lane=0;lane<3;lane++){
   const y=rows[lane], x=playing?Math.round(3+column*span):3;
   for(let h=-1;h<=1;h++)for(let w=-1;w<=1;w++){
     image[y+h][x+w]=color[playing?trains[lane]:"ABC"[lane]];
     image[y+h][68+w]=color[yard.goal[lane]];
   }
 }
 const bitmap=["! XPM2","72 16 7 1",". c #07111B","t c #394959","s c #7796A1","w c #FFCA63","r c #F86250","g c #5BD689","b c #568DFF",...image.map(row=>row.join(""))].join("\n");
 return [{id:"yard",type:"xpmbitmap",data:bitmap},...panel("SIGNAL BOX  "+(level+1)+"/8",[
 "In: ABC   Target: "+yard.goal, "A red / B green / C blue",
 "Point "+(selected+1)+": "+((switches&(1<<selected))?"cross":"straight"),"Moves "+moves+"   Record "+(records[level]||"-"),
 result|| (playing?"Dispatching...":"Wheel: point / OK: flip"),result==="Arrived!"?"Click for next yard":"Start: dispatch / hold: reset"])];
}
const refresh=surface(draw,input,stop);
