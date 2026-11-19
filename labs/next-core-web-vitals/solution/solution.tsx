export type Metric='LCP'|'INP'|'CLS';
export function vitalsGrade(metric:Metric,value:number){
 if(!Number.isFinite(value)||value<0)throw new RangeError('Invalid vital');
 const good={LCP:2500,INP:200,CLS:0.1};const poor={LCP:4000,INP:500,CLS:0.25};
 return value<=good[metric]?'good':value>poor[metric]?'poor':'needs-improvement';
}
