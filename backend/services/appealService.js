import user from "../model/UserSchema.js";
import { createNotification } from "../utilies/notifications.js";

export function canSubmitAppeal({ status, appealStatus }) {
  if (status !== "Rejected") {
    return { ok: false, message: "Only rejected reports can be appealed" };
  }
  if (appealStatus === "pending") {
    return { ok: false, message: "An appeal is already pending review" };
  }
  if (appealStatus === "denied") {
    return { ok: false, message: "This appeal was denied and cannot be resubmitted" };
  }
  return { ok: true };
}

export async function notifyAdminsOfAppeal(report) {
  const admins = await user
    .find({ role: "admin", deletestate: { $ne: true } })
    .select("_id");

  await Promise.all(
    admins.map((admin) =>
      createNotification({
        userId: admin._id,
        title: "New appeal submitted",
        message: `A citizen appealed a rejected ${report.type} report.`,
        type: "status",
        link: `/admincomplaintdetail/${report._id}`,
      })
    )
  );
}
