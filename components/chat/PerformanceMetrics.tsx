const metrics = [
  {
    label: "Documentation",
    value: "98%",
    width: "98%",
  },
  {
    label: "Code Structure",
    value: "92%",
    width: "92%",
  },
  {
    label: "Testing Coverage",
    value: "88%",
    width: "88%",
  },
  {
    label: "Security Audit",
    value: "96%",
    width: "96%",
  },
];

export default function PerformanceMetrics() {
  return (
    <div className="col-span-12 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl md:col-span-8">
      
      <h3 className="mb-8 text-2xl font-semibold text-white">
        Performance Metrics
      </h3>

      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
        
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="space-y-2"
          >
            <div className="flex justify-between text-xs uppercase tracking-widest text-zinc-500">
              <span>{metric.label}</span>
              <span className="text-white">
                {metric.value}
              </span>
            </div>

            <div className="h-1 overflow-hidden rounded-full bg-zinc-800">
              <div
                style={{ width: metric.width }}
                className="h-full bg-white"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}