import { shallowMount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';

import { useQuizStore } from '@/stores/quiz';
import { useQuestions } from '@/composables/questions';

import QuizContent from './QuizContent.vue';

vi.mock('@/composables/questions', () => ({
  useQuestions: vi.fn().mockReturnValue({
    questions: {
      value: []
    }
  })
}));

describe('QuizContent.vue', () => {
  let wrapper: ReturnType<typeof shallowMount>;
  let quizStore: ReturnType<typeof useQuizStore>;
  let questionsUtil: ReturnType<typeof useQuestions>;

  beforeEach(() => {
    wrapper = shallowMount(QuizContent, {
      global: {
        plugins: [createTestingPinia()]
      }
    });
    quizStore = useQuizStore();
    questionsUtil = useQuestions();
  });

  it('should render QuizHeader, QuizMain, and QuizFooter components', async () => {
    questionsUtil.questions.value = [
      { question: 'Question 1', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', tag: 'tag1' },
      { question: 'Question 2', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B', tag: 'tag2' },
      { question: 'Question 3', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C', tag: 'tag3' }
    ];
    await wrapper.vm.$nextTick();
    expect(wrapper.findComponent({ name: 'QuizHeader' }).exists()).toBe(true);
    expect(wrapper.findComponent({ name: 'QuizMain' }).exists()).toBe(false);
    expect(wrapper.findComponent({ name: 'QuizFooter' }).exists()).toBe(true);
  });

  it('should call onFinish when QuizHeader emits on-timer-out', async () => {
    questionsUtil.questions.value = [];
    await wrapper.findComponent({ name: 'QuizHeader' }).vm.$emit('on-timer-out');
    expect(quizStore.answers).toEqual({ correct: 0, incorrect: 0, unanswered: 0 });
  });

  it('should call onFinish when QuizFooter emits on-quiz-finish', async () => {
    await wrapper.findComponent({ name: 'QuizFooter' }).vm.$emit('on-quiz-finish');
    expect(quizStore.answers).toEqual({ correct: 0, incorrect: 0, unanswered: 0 });
  });

  it('should call onQuit when QuizFooter emits on-quiz-quit', async () => {
    vi.spyOn(quizStore, 'resetQuiz');
    await wrapper.findComponent({ name: 'QuizFooter' }).vm.$emit('on-quiz-quit');
    expect(quizStore.resetQuiz).toHaveBeenCalled();
    expect(questionsUtil.questions.value).toEqual([]);
  });

  it('should call onRestart when QuizFooter emits on-quiz-restart', async () => {
    vi.spyOn(quizStore, 'resetQuizProps');
    await wrapper.findComponent({ name: 'QuizFooter' }).vm.$emit('on-quiz-restart');
    expect(quizStore.resetQuizProps).toHaveBeenCalled();
    expect(quizStore.status).toBe('started');
  });

  it('should update answers correctly when onFinish is called', async () => {
    questionsUtil.questions.value = [
      { question: 'Question 1', options: ['A', 'B', 'C', 'D'], correctAnswer: 'A', tag: 'tag1' },
      { question: 'Question 2', options: ['A', 'B', 'C', 'D'], correctAnswer: 'B', tag: 'tag2' },
      { question: 'Question 3', options: ['A', 'B', 'C', 'D'], correctAnswer: 'C', tag: 'tag3' }
    ];
    quizStore.selectedOptions = [
      { index: 0, selected: 'A' },
      { index: 1, selected: 'D' }
    ];
    await wrapper.findComponent({ name: 'QuizFooter' }).vm.$emit('on-quiz-finish');
    expect(quizStore.answers).toEqual({ correct: 1, incorrect: 1, unanswered: 1 });
  });
});
