import type { ReactNode } from "react";
import type { TemplateId } from "@/data/templates";
import { cn } from "@/lib/utils";

/*
 * Illustrative invitations for the landing page.
 * Sizes use container query units so each card scales to whatever width it is given.
 * These are not the real templates; Phase 4 replaces them with InvitationRenderer output.
 */

function Card({ className, children }: { className?: string; children: ReactNode }) {
  return (
    <div className="@container w-full">
      <div className={cn("relative aspect-[4/5] w-full overflow-hidden", className)}>{children}</div>
    </div>
  );
}

function Sprig({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" fill="none" aria-hidden="true" className={className}>
      <path d="M8 112C30 80 54 50 112 8" stroke="#6B7A5E" strokeWidth="1.2" strokeLinecap="round" />
      {[
        [26, 86, -20],
        [40, 68, -60],
        [52, 52, -20],
        [66, 38, -60],
        [80, 26, -20],
        [94, 16, -60],
      ].map(([x, y, r], i) => (
        <ellipse key={i} cx={x} cy={y} rx="11" ry="4.5" transform={`rotate(${r} ${x} ${y})`} fill="#A3B391" opacity="0.75" />
      ))}
      <circle cx="104" cy="14" r="4" fill="#D9A9A0" />
    </svg>
  );
}

function ElegantWedding() {
  return (
    <Card className="bg-[#F6F1E8] font-serif text-[#3A3128]">
      <div className="absolute inset-[5cqw] border border-[#8A7352]/60" />
      <div className="absolute inset-0 flex flex-col items-center justify-center px-[14cqw] text-center">
        <p className="font-sans text-[2.6cqw] uppercase tracking-[0.3em] text-[#8A7352]">Together with their families</p>
        <h3 className="mt-[8cqw] text-[13cqw] font-medium leading-[0.95]">
          Eleanor
          <span className="block text-[6cqw] italic text-[#8A7352]">and</span>
          James
        </h3>
        <div className="my-[8cqw] h-px w-[12cqw] bg-[#8A7352]/70" />
        <p className="text-[5cqw]">Saturday, 14 June 2026</p>
        <p className="mt-[1.5cqw] font-sans text-[2.8cqw] uppercase tracking-[0.2em] text-[#6F6556]">The Garden Pavilion</p>
      </div>
    </Card>
  );
}

function FloralWedding() {
  return (
    <Card className="bg-[#EEF0E8] font-serif text-[#3E4A39]">
      <Sprig className="absolute -left-[3cqw] -top-[3cqw] w-[36cqw] -scale-x-100" />
      <Sprig className="absolute -bottom-[3cqw] -right-[3cqw] w-[36cqw] rotate-180 -scale-x-100" />
      <div className="absolute inset-0 flex flex-col justify-center px-[12cqw] pt-[14cqw]">
        <p className="font-sans text-[2.6cqw] uppercase tracking-[0.28em] text-[#7A8870]">You are invited to celebrate</p>
        <h3 className="mt-[5cqw] text-[14cqw] font-normal italic leading-[0.95]">
          Sofia
          <span className="block pl-[10cqw]">&amp; Daniel</span>
        </h3>
        <p className="mt-[9cqw] text-[5cqw]">September 20, 2026</p>
        <p className="text-[4cqw] text-[#6A7762]">Olive Grove Estate · 4 pm</p>
      </div>
    </Card>
  );
}

function MinimalWedding() {
  return (
    <Card className="bg-[#FBFBF9] font-sans text-[#1D1D1B]">
      <div className="absolute inset-[9cqw] flex flex-col justify-between">
        <div className="flex justify-between text-[2.8cqw] uppercase tracking-[0.2em] text-[#6F6C65]">
          <span>Wedding</span>
          <span>09 · 20 · 26</span>
        </div>
        <h3 className="text-[17cqw] font-light leading-[0.9] tracking-tight">
          Lena
          <span className="block text-[#9B978F]">Marc</span>
        </h3>
        <div className="border-t border-[#1D1D1B] pt-[3cqw] text-[3.2cqw] leading-snug">
          <p>Lakeside Studio, Zürich</p>
          <p className="text-[#6F6C65]">Ceremony at 3:00 pm</p>
        </div>
      </div>
    </Card>
  );
}

function ModernBirthday() {
  return (
    <Card className="bg-[#FF6B3D] font-sans text-[#1D1D1B]">
      <div className="absolute -right-[14cqw] -top-[14cqw] size-[62cqw] rounded-full bg-[#FFE9D6]" />
      <div className="absolute -bottom-[10cqw] left-[8cqw] size-[26cqw] rotate-12 bg-[#1D1D1B]" />
      <div className="absolute inset-0 flex flex-col justify-end p-[9cqw]">
        <p className="text-[3cqw] font-semibold uppercase tracking-[0.2em]">You&apos;re invited</p>
        <h3 className="mt-[2cqw] text-[19cqw] font-extrabold leading-[0.85] tracking-tighter">
          Maya
          <span className="block">turns 30</span>
        </h3>
        <p className="mt-[5cqw] text-[3.6cqw] font-medium">Sat 12 Oct · 8 pm · The Rooftop</p>
        <div className="h-[22cqw]" />
      </div>
    </Card>
  );
}

const samples: Record<TemplateId, () => ReactNode> = {
  "elegant-wedding": ElegantWedding,
  "floral-wedding": FloralWedding,
  "minimal-wedding": MinimalWedding,
  "modern-birthday": ModernBirthday,
};

export function SampleInvitation({ id }: { id: TemplateId }) {
  const Sample = samples[id];
  return <Sample />;
}
