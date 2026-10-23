export default function Cell({ value, onChange, type = 'text', options, step }) {
  if (options) {
    return (
      <select className="cell" value={value} onChange={e => onChange(e.target.value)}>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    )
  }
  if (type === 'number') {
    return (
      <input
        className="cell"
        type="number"
        step={step || 'any'}
        value={value}
        onChange={e => onChange(e.target.value === '' ? 0 : Number(e.target.value))}
      />
    )
  }
  return <input className="cell" type={type} value={value} onChange={e => onChange(e.target.value)} />
}
