import { useEffect, useMemo, useState } from "react"
import api from "../api/client"
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/card"

type Row = { _id: string; count: number }

export default function Dashboard(){
  const [rows,setRows] = useState<Row[]>([])
  useEffect(()=>{ (async()=>{ const r = await api.get("/stats/review-activity?days=120"); setRows(r.data) })() },[])
  const total = useMemo(()=>rows.reduce((s,r)=>s+r.count,0),[rows])
  const max = useMemo(()=>rows.reduce((m,r)=>Math.max(m,r.count),0)||1,[rows])
  const streak = useMemo(()=>{
    let s=0
    const set = new Set(rows.map(r=>r._id))
    const d = new Date()
    for(;;){
      const dstr = d.toISOString().slice(0,10)
      if(set.has(dstr)){ s+=1; d.setDate(d.getDate()-1) } else break
    }
    return s
  },[rows])

  return (
    <div className="grid lg:grid-cols-3 gap-4">
      <Card className="lg:col-span-2">
        <CardHeader><CardTitle>Daily reviews</CardTitle></CardHeader>
        <CardBody>
          <div className="grid grid-cols-12 gap-1">
            {rows.map((r,i)=>(
              <div key={i} className="h-6 rounded" style={{ backgroundColor:`hsl(160 70% ${40 + (r.count/max)*40}%)` }} title={`${r._id}: ${r.count}`} />
            ))}
          </div>
          <div className="text-xs text-zinc-400 mt-2">Last 120 days</div>
        </CardBody>
      </Card>
      <div className="grid gap-4">
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-400">Total reviews</div>
            <div className="text-3xl font-semibold mt-1">{total}</div>
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <div className="text-sm text-zinc-400">Current streak</div>
            <div className="text-3xl font-semibold mt-1">{streak}d</div>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}
