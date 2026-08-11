const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function addBusinessDays(date, days) {
  const result = new Date(date);
  let added = 0;
  while (added < days) {
    result.setDate(result.getDate() + 1);
    const day = result.getDay();
    if (day !== 0 && day !== 6) added++;
  }
  return result;
}

export function getEstimatedDelivery(minDays = 3, maxDays = 5) {
  const today = new Date();
  const earliest = addBusinessDays(today, minDays);
  const latest = addBusinessDays(today, maxDays);

  const format = (d) => `${DAY_NAMES[d.getDay()]}, ${MONTH_NAMES[d.getMonth()]} ${d.getDate()}`;

  if (earliest.getTime() === latest.getTime()) {
    return format(earliest);
  }
  return `${format(earliest)} – ${format(latest)}`;
}

export function getDeliveryLabel(minDays = 3, maxDays = 5) {
  const today = new Date();
  const deliveryDate = addBusinessDays(today, maxDays);
  const label = `${DAY_NAMES[deliveryDate.getDay()]}, ${MONTH_NAMES[deliveryDate.getMonth()]} ${deliveryDate.getDate()}`;
  return `Delivery by ${label}`;
}

export const SHIPPING_CHARGE = 150;
export const DELIVERY_DAYS = { min: 3, max: 5 };
