import JSXLessonMDX from './lessons/06.01.01.mdx';
import BrowserLesson from './lessons/00.01.01.mdx';
import LifecycleLesson from './lessons/00.01.02.mdx';
export function LessonArticle({lessonId}: {lessonId:string}) {
  switch (lessonId) {
    case '00.01.01': return <BrowserLesson />;
    case '00.01.02': return <LifecycleLesson />;
    case '06.01.01': return <JSXLessonMDX />;
    default: return null;
  }
}
