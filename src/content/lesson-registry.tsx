import JSXLessonMDX from './lessons/06.01.01.mdx';
import BrowserLesson from './lessons/00.01.01.mdx';
import LifecycleLesson from './lessons/00.01.02.mdx';
import Foundation3 from './lessons/00.01.03.mdx';
import Foundation4 from './lessons/00.01.04.mdx';
import Foundation5 from './lessons/00.01.05.mdx';
import Foundation6 from './lessons/00.01.06.mdx';
import Foundation7 from './lessons/00.01.07.mdx';
import Foundation8 from './lessons/00.01.08.mdx';
export function LessonArticle({lessonId}: {lessonId:string}) {
  switch (lessonId) {
    case '00.01.01': return <BrowserLesson />;
    case '00.01.02': return <LifecycleLesson />;
    case '00.01.03': return <Foundation3 />;
    case '00.01.04': return <Foundation4 />;
    case '00.01.05': return <Foundation5 />;
    case '00.01.06': return <Foundation6 />;
    case '00.01.07': return <Foundation7 />;
    case '00.01.08': return <Foundation8 />;
    case '06.01.01': return <JSXLessonMDX />;
    default: return null;
  }
}
