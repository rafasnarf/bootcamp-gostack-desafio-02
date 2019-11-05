/* eslint-disable class-methods-use-this */
import * as Yup from 'yup';
import Subscription from '../models/Subscription';

class SubscriptionController {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number()
        .positive()
        .required(),
      montlhyPrice: Yup.number()
        .positive()
        .required(),
    });
    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Faltam dados a serem preenchidos' });
    }
    /* const subscriptionExists = await Subscription.findOne({
      where: { title: req.body.title },
    });
    if (subscriptionExists) {
      return res.status(400).json({ error: 'Plano já cadastrado' });
    } */

    Subscription.create(req.body);
    return res.json(req.body);
  }
}

export default new SubscriptionController();
