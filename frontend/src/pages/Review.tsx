import { useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import api from "../api/client"
import { Card, CardBody } from "../components/ui/card"
import { Button } from "../components/ui/button"
import { Select } from "../components/ui/select"

type CardT = { _id:string; front:string; back:string }
function key(deckId:string){ return `queue_${deckId}` }

export default function Review(){
  const { deckId } = useParams()
  const [queue,setQueue] = useState<CardT[]>([])
  const [showBack,setShowBack] = useState(false)
  const [loading,setLoading] = useState(true)
  const [busy,setBusy] = useState(false)
  const [ahead,setAhead] = useState(0)
  const deckKey = useMemo(()=>key(deckId!),[deckId])

  const load = async()=>{
    setLoading(true)
    try{
      const r = await api.get(`/decks/${deckId}/queue${ahead>0?`?ahead=${ahead}`:""}`)
      setQueue(r.data); localStorage.setItem(deckKey, JSON.stringify(r.data))
    }catch(e){
      const cached = localStorage.getItem(deckKey)
      if(cached) setQueue(JSON.parse(cached))
    }finally{ setLoading(false) }
  }
  useEffect(()=>{ load() },[deckId, ahead])

  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{
      if(busy) return
      if(!showBack && e.key===" "){ e.preventDefault(); setShowBack(true); return }
      if(showBack){
        if(e.key==="1") answer(0)
        if(e.key==="2") answer(1)
        if(e.key==="3") answer(2)
        if(e.key==="4") answer(3)
      }
    }
    window.addEventListener("keydown", onKey)
    return ()=>window.removeEventListener("keydown", onKey)
  },[showBack, busy, queue])

  const answer = async(grade:number)=>{
    if(!queue.length) return
    const current = queue[0]
    setBusy(true); setShowBack(false); setQueue(q=>q.slice(1))
    try{ await api.post(`/cards/${current._id}/review`,{ grade }) } finally { setBusy(false) }
  }

  if(loading) return <div className="mt-10">Loading...</div>
  if(!queue.length) return (
    <div className="mt-12 max-w-lg">
      <div className="text-lg font-medium">No cards {ahead>0?"available":"due"}.</div>
      <div className="mt-3 flex items-center gap-2">
        <div className="text-sm text-zinc-400">Study ahead</div>
        <Select value={ahead} onChange={e=>setAhead(Number(e.target.value))} >
          <option value={0}>Off</option><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
        </Select>
      </div>
    </div>
  )

  const current = queue[0]
  const remaining = queue.length
  const pct = Math.round(((Math.max(remaining,1)-1)/Math.max(remaining,1))*100)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="text-sm text-zinc-400">Remaining {remaining}</div>
        <div className="flex items-center gap-2">
          <div className="text-sm text-zinc-400">Study ahead</div>
          <Select value={ahead} onChange={e=>setAhead(Number(e.target.value))}>
            <option value={0}>Off</option><option value={5}>5</option><option value={10}>10</option><option value={20}>20</option>
          </Select>
        </div>
      </div>
      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden">
        <div className="h-full bg-white" style={{ width: `${pct}%` }} />
      </div>
      <Card className="p-0 overflow-hidden">
        <CardBody className="p-8 md:p-12">
          <div className="text-2xl md:text-3xl leading-relaxed whitespace-pre-wrap">{showBack ? current.back : current.front}</div>
        </CardBody>
      </Card>
      {!showBack ? (
        <Button size="lg" onClick={()=>setShowBack(true)}>Show answer (Space)</Button>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Button variant="outline" onClick={()=>answer(0)}>Again (1)</Button>
          <Button variant="outline" onClick={()=>answer(1)}>Hard (2)</Button>
          <Button variant="secondary" onClick={()=>answer(2)}>Good (3)</Button>
          <Button onClick={()=>answer(3)}>Easy (4)</Button>
        </div>
      )}
    </div>
  )
}
