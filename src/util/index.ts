export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMsgOpt = (dur=3000) => {
  return {
    offset:[0,0],
    className:'msg-animation-active  rounded-md',
    duration:dur, 
    style:{
      animationDuration:`${dur/1000}s`
    }
  }
}