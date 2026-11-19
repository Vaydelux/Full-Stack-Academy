export function sampleRuntime(){
 const memory=process.memoryUsage();
 const cpu=process.cpuUsage();
 return {rss:memory.rss,heapUsed:memory.heapUsed,userCpuMicros:cpu.user};
}
