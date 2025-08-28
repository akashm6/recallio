import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import { Link } from "react-router-dom";
import { Card, CardBody, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Input } from "../components/ui/input";
import { Select } from "../components/ui/select";
import { Plus, Upload, Download } from "lucide-react";

type DeckSum = {
  _id: string;
  title: string;
  tags: string[];
  total: number;
  due: number;
};

export default function Decks() {
  const [decks, setDecks] = useState<DeckSum[]>([]);
  const [title, setTitle] = useState("");
  const [tagInput, setTagInput] = useState("");
  const [quickFront, setQuickFront] = useState("");
  const [quickBack, setQuickBack] = useState("");
  const [targetDeck, setTargetDeck] = useState<string>("");
  const tags = useMemo(
    () =>
      tagInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    [tagInput]
  );

  const load = async () => {
    const r = await api.get("/decks/summary");
    setDecks(r.data);
  };
  useEffect(() => {
    load();
  }, []);

  const create = async (e: any) => {
    e.preventDefault();
    if (!title.trim()) return;
    await api.post("/decks", { title, tags });
    setTitle("");
    setTagInput("");
    await load();
  };

  const addQuick = async () => {
    if (!targetDeck || !quickFront.trim() || !quickBack.trim()) return;
    await api.post("/cards", {
      deckId: targetDeck,
      front: quickFront,
      back: quickBack,
    });
    setQuickFront("");
    setQuickBack("");
    await load();
  };

  const exportDeck = async (id: string) => {
    const res = await api.get(`/decks/${id}/export`, { responseType: "blob" });
    const blob = new Blob([res.data], { type: "text/csv" });

    const disp = res.headers["content-disposition"] as string | undefined;
    const match = disp?.match(/filename="([^"]+)"/i);
    const filename = match?.[1] ?? `deck-${id}.csv`;

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardBody>
          <form onSubmit={create} className="grid md:grid-cols-3 gap-3">
            <Input
              placeholder="New deck title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Input
              placeholder="tags comma-separated"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
            />
            <Button className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Create
            </Button>
          </form>
        </CardBody>
      </Card>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map((d) => (
          <Card
            key={d._id}
            className="group hover:shadow-[0_0_0_1px_rgba(255,255,255,.06)] hover:-translate-y-0.5 transition"
          >
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="truncate">{d.title}</span>
                <Badge
                  className={
                    d.due > 0
                      ? "bg-emerald-500/20 border-emerald-600/40 text-emerald-300"
                      : ""
                  }
                >
                  {d.due} due
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardBody>
              <div className="text-xs text-zinc-400 h-4">
                {d.tags?.join(", ")}
              </div>
              <div className="text-xs text-zinc-500 mt-1">Total {d.total}</div>
              <div className="mt-4 flex items-center gap-2">
                <Link to={`/review/${d._id}`}>
                  <Button variant="secondary">Review</Button>
                </Link>
                <Button variant="outline" onClick={() => exportDeck(d._id)}>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const form = new FormData();
                      form.append("file", file);
                      await api.post(`/decks/${d._id}/import`, form, {
                        headers: { "Content-Type": "multipart/form-data" },
                      });
                      e.currentTarget.value = "";
                      await load();
                    }}
                  />
                  <span>
                    <Button variant="outline">
                      <Upload className="h-4 w-4 mr-2" />
                      Import
                    </Button>
                  </span>
                </label>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick add card</CardTitle>
        </CardHeader>
        <CardBody>
          <div className="grid md:grid-cols-4 gap-3">
            <Select
              value={targetDeck}
              onChange={(e) => setTargetDeck(e.target.value)}
            >
              <option value="">Select deck</option>
              {decks.map((d) => (
                <option key={d._id} value={d._id}>
                  {d.title}
                </option>
              ))}
            </Select>
            <Input
              placeholder="Front"
              value={quickFront}
              onChange={(e) => setQuickFront(e.target.value)}
            />
            <Input
              placeholder="Back"
              value={quickBack}
              onChange={(e) => setQuickBack(e.target.value)}
            />
            <Button onClick={addQuick}>Add</Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
