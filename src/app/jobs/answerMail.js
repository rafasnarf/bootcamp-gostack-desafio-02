/* eslint-disable class-methods-use-this */
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { answerExists, studentExists, answerDate, answer } = data;

    await Mail.sendMail({
      to: `${studentExists.name} <${studentExists.email}>`,
      subject: 'Sua solicitação foi respondida',
      template: 'answer',
      context: {
        student: studentExists.name,
        dateAnswer: format(
          parseISO(answerDate),
          "'Dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        question: answerExists.question,
        answer,
      },
    });
  }
}

export default new AnswerMail();
