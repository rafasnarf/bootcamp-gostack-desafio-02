/* eslint-disable class-methods-use-this */
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle({ data }) {
    const {
      studentExists,
      subscriptions,
      parsedDate,
      endDate,
      totalprice,
    } = data;

    await Mail.sendMail({
      to: `${studentExists.name} <${studentExists.email}>`,
      subject: 'Bem vindo a GymPoint',
      template: 'registration',
      context: {
        student: studentExists.name,
        title: subscriptions.title,
        start_date: format(
          parseISO(parsedDate),
          "'Dia' dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(parseISO(endDate), "'Dia' dd 'de' MMMM 'de' yyyy", {
          locale: pt,
        }),
        total_price: totalprice,
      },
    });
  }
}

export default new RegistrationMail();
