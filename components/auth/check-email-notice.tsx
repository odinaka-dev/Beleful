import { Sms } from "iconsax-reactjs";

interface CheckEmailNoticeProps {
  email: string;
}

/** Shown after a successful signUp() — email confirmation is required on
 * this project, so there's no session (and nowhere useful to redirect) until
 * the user clicks the link in their inbox. */
export function CheckEmailNotice({ email }: CheckEmailNoticeProps) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-2xl border border-[#00452E]/10 bg-[#00452E]/[0.03] px-6 py-10 text-center">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-[#00452E] text-white">
        <Sms size={22} variant="Bold" />
      </span>
      <div>
        <h2 className="font-heading text-lg font-bold text-[#111111]">
          Confirm your email
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[#666666]">
          We sent a confirmation link to <strong>{email}</strong>. Click it to
          activate your account, then come back here to log in.
        </p>
      </div>
    </div>
  );
}
