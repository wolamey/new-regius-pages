import { Calculator as CalculatorIcon } from "lucide-react";
import { useMemo, useState, type InputHTMLAttributes } from "react";
import { track } from "../lib/analytics";
import type { OfferCode } from "../types";

interface CalculatorProps {
  offerCode: OfferCode;
  pagePath: string;
}

function safeNumber(value: string, fallback = 0) {
  const number = Number(value.replace(",", "."));
  return Number.isFinite(number) && number >= 0 ? number : fallback;
}

export function CapacityCalculator({ offerCode, pagePath }: CalculatorProps) {
  const [orders, setOrders] = useState("400");
  const [minutesBefore, setMinutesBefore] = useState("3");
  const [minutesAfter, setMinutesAfter] = useState("1");
  const [workdays, setWorkdays] = useState("22");
  const [employees, setEmployees] = useState("10");
  const [salary, setSalary] = useState("1500");
  const [calculated, setCalculated] = useState(false);

  const result = useMemo(() => {
    const orderCount = safeNumber(orders);
    const before = safeNumber(minutesBefore);
    const after = Math.min(safeNumber(minutesAfter), before);
    const days = safeNumber(workdays);
    const employeeCount = Math.max(1, safeNumber(employees, 1));
    const monthlySalary = safeNumber(salary);
    const savedMinutesDay = orderCount * Math.max(0, before - after);
    const savedHoursDay = savedMinutesDay / 60;
    const savedHoursMonth = savedHoursDay * days;
    const fte = savedHoursDay / 8;
    const capacityShare = Math.min(1, fte / employeeCount);
    return {
      savedHoursDay,
      savedHoursMonth,
      fte,
      salaryCapacity: monthlySalary ? monthlySalary * fte : 0,
      capacityShare,
    };
  }, [orders, minutesBefore, minutesAfter, workdays, employees, salary]);

  const calculate = () => {
    setCalculated(true);
    track("calculator_complete", { offer_code: offerCode, page_path: pagePath, block: "calculator" });
  };

  return (
    <section className="section calculator-section" aria-labelledby="calculator-title">
      <div className="container calculator-layout">
        <div className="section-heading sticky-copy">
          <span className="section-kicker"><CalculatorIcon aria-hidden="true" size={16} /> Калькулятор рабочей ёмкости</span>
          <h2 id="calculator-title">Сколько времени сейчас занимает ручной перенос?</h2>
          <p>Введите свои значения. Расчёт показывает резерв времени команды и не предполагает увольнение сотрудников.</p>
        </div>
        <div className="calculator-panel">
          <div className="calculator-fields">
            <NumberField label="Заявок в день" value={orders} onChange={setOrders} min="1" />
            <NumberField label="Минут на заявку сейчас" value={minutesBefore} onChange={setMinutesBefore} min="0.1" step="0.1" />
            <NumberField label="Минут после изменения" value={minutesAfter} onChange={setMinutesAfter} min="0" step="0.1" />
            <NumberField label="Рабочих дней в месяц" value={workdays} onChange={setWorkdays} min="1" max="31" />
            <NumberField label="Сотрудников в процессе" value={employees} onChange={setEmployees} min="1" />
            <NumberField label="Начисленная зарплата, BYN (необязательно)" value={salary} onChange={setSalary} min="0" />
          </div>
          <button type="button" className="button button-primary calculate-button" onClick={calculate}>
            Рассчитать резерв времени
          </button>

          <div className={`calculator-result ${calculated ? "is-visible" : ""}`} aria-live="polite" aria-atomic="true">
            {calculated ? (
              <>
                <div><strong>{format(result.savedHoursDay)} ч</strong><span>в день</span></div>
                <div><strong>{format(result.savedHoursMonth)} ч</strong><span>в месяц</span></div>
                <div><strong>{format(result.fte)} ставки</strong><span>расчётный эквивалент</span></div>
                {result.salaryCapacity > 0 && <div><strong>{format(result.salaryCapacity)} BYN</strong><span>фонд ёмкости в месяц</span></div>}
                <p>
                  Это предварительный расчёт по введённым данным, а не обещание прямого сокращения расходов. Высвобождённое время может быть направлено на другие задачи.
                </p>
              </>
            ) : (
              <p>Результат появится после расчёта.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NumberField({ label, value, onChange, ...inputProps }: { label: string; value: string; onChange: (value: string) => void } & Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "onChange" | "type">) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type="number" inputMode="decimal" value={value} onChange={(event) => onChange(event.target.value)} {...inputProps} />
    </label>
  );
}

function format(number: number) {
  return new Intl.NumberFormat("ru-BY", { maximumFractionDigits: 1 }).format(number);
}
