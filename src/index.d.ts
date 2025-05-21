type UdpEvent = {
  event: 'dataIn',
  data:{data:UdpDataItem[]},
}

type UdpEvent2 = {
  event: 'dataIn',
  data:{data:UdpDataItem2},
}

type UdpDataItem = {
  name: string
    val: string
} 

type UdpDataItem2 = {
  power:number[][]
  torque:number[][]
} 

type DownloadEvent =
  | {
      event: 'started';
      data: {
        url: string;
        downloadId: number;
        contentLength: number;
      };
    }
    | {
      event: 'Started';
      data: {
        url: string;
        downloadId: number;
        contentLength: number;
      };
    }
  | {
      event: 'progress';
      data: {
        downloadId: number;
        chunkLength: number;
      };
    }
  | {
      event: 'finished';
      data: {
        downloadId: number;
      };
    };
