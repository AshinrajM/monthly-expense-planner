import mongoose from 'mongoose';

const PaymentPlanSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    durationMonths: { type: Number, required: true },
    monthlyAmount: { type: Number, required: true },
    splitMonths: { type: Number },
    startMonth: { type: String, required: true },
    dueDay: { type: Number, required: true },
    createdAt: { type: String, default: () => new Date().toISOString() }
  },
  { timestamps: true }
);

const MonthlyStatusSchema = new mongoose.Schema(
  {
    monthStr: { type: String, required: true, unique: true },
    statuses: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

export const PaymentPlanModel = mongoose.models.PaymentPlan || mongoose.model('PaymentPlan', PaymentPlanSchema);
export const MonthlyStatusModel = mongoose.models.MonthlyStatus || mongoose.model('MonthlyStatus', MonthlyStatusSchema);
