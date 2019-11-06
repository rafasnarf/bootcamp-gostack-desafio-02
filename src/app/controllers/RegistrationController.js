import { addDays, startOfDay, parseISO } from 'date-fns';
import Registrations from '../models/Registration';
import Subscription from '../models/Subscription';
import Student from '../models/Student';

class RegistrationController {
  // eslint-disable-next-line class-methods-use-this
  async store(req, res) {
    const { subscription_id, student_id, start_date } = req.body;
    const subExists = await Subscription.findOne({
      where: { id: subscription_id },
    });
    if (!subExists) {
      return res.status(400).json({ error: 'Não existe esse tipo de plano' });
    }
    const studentExists = await Student.findOne(
      { where: { id: student_id } },
      {
        include: [
          {
            model: Student,
            as: 'student_id',
            attributes: ['name', 'email'],
          },
        ],
      }
    );
    if (!studentExists) {
      return res.status(400).json({ error: 'Aluno não cadastrado' });
    }
    const regExists = await Registrations.findOne({
      where: { student_id, subscription_id },
    });
    if (regExists) {
      return res
        .status(400)
        .json({ error: 'Aluno já possui plano, selecione alteração de plano' });
    }
    const subscriptions = await Subscription.findOne(
      { where: { id: subscription_id } },
      {
        include: [
          {
            model: Subscription,
            as: 'subscription_id',
            attributes: ['id', 'title', 'duration', 'price'],
          },
        ],
      }
    );
    const parsedDate = parseISO(start_date);
    const endDate = addDays(startOfDay(parsedDate), 30);
    const totalprice = parseFloat(subscriptions.price * subscriptions.duration);
    const registration = await Registrations.create({
      start_date: parsedDate,
      end_date: endDate,
      totalprice,
      student_id,
      subscription_id,
    });
    return res.json(registration);
  }
}
export default new RegistrationController();
