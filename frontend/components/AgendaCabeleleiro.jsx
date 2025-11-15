import React, { useEffect, useState } from "react";

export default function AgendaCabeleleiro() {
  const [nomeCliente, setNomeCliente] = useState("");
  const [servico, setServico] = useState("");
  const [dataHorario, setDataHorario] = useState("");
  const [agendamentos, setAgendamentos] = useState([]);

  // URL das Netlify Functions (serverless) - relative path
  const fnBase = "/.netlify/functions";

  async function carregarAgendamentos() {
    try {
      const res = await fetch(`${fnBase}/agendamentos-get`);
      if (!res.ok) throw new Error("Erro ao obter agendamentos");
      const dados = await res.json();
      setAgendamentos(dados);
      if (typeof window !== 'undefined') localStorage.setItem('agenda_cabeleleiro', JSON.stringify(dados));
    } catch (e) {
      const salvo = typeof window !== 'undefined' ? localStorage.getItem('agenda_cabeleleiro') : null;
      if (salvo) setAgendamentos(JSON.parse(salvo));
      else setAgendamentos([]);
      console.warn('Fallback para storage local', e);
    }
  }

  useEffect(() => { carregarAgendamentos(); }, []);

  async function adicionarAgendamento() {
    if (!nomeCliente || !servico || !dataHorario) return;
    const novo = { id: Date.now(), nomeCliente, servico, dataHorario };

    try {
      const res = await fetch(`${fnBase}/agendamentos-post`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novo),
      });
      if (!res.ok) throw new Error('Falha ao salvar');
      const salvo = await res.json();
      setAgendamentos(prev => {
        const atualizado = [...prev, salvo[0] || salvo];
        if (typeof window !== 'undefined') localStorage.setItem('agenda_cabeleleiro', JSON.stringify(atualizado));
        return atualizado;
      });
    } catch (e) {
      const atual = [...agendamentos, novo];
      setAgendamentos(atual);
      if (typeof window !== 'undefined') localStorage.setItem('agenda_cabeleleiro', JSON.stringify(atual));
      console.warn('Salvo localmente devido a falha no servidor', e);
    }

    setNomeCliente('');
    setServico('');
    setDataHorario('');
  }

  async function removerAgendamento(id) {
    try {
      const res = await fetch(`${fnBase}/agendamentos-delete?id=${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao remover');
      setAgendamentos(prev => {
        const atualizado = prev.filter(a => a.id !== id);
        if (typeof window !== 'undefined') localStorage.setItem('agenda_cabeleleiro', JSON.stringify(atualizado));
        return atualizado;
      });
    } catch (e) {
      const atualizado = agendamentos.filter(a => a.id !== id);
      setAgendamentos(atualizado);
      if (typeof window !== 'undefined') localStorage.setItem('agenda_cabeleleiro', JSON.stringify(atualizado));
      console.warn('Removido localmente devido a falha no servidor', e);
    }
  }

  return (
    <div style={{ minHeight: '100vh', background:'#f3f4f6', padding:24, display:'flex', flexDirection:'column', alignItems:'center', gap:24 }}>
      <h1 style={{ fontSize:28, fontWeight:700 }}>Agenda de Cabeleleiro</h1>

      <div style={{ width:'100%', maxWidth:720, padding:16, borderRadius:20, boxShadow:'0 6px 18px rgba(0,0,0,0.06)', background:'#fff' }}>
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          <input style={{ padding:12, borderRadius:12, border:'1px solid #e5e7eb' }} placeholder='Nome do cliente' value={nomeCliente} onChange={e=>setNomeCliente(e.target.value)} />
          <input style={{ padding:12, borderRadius:12, border:'1px solid #e5e7eb' }} placeholder='Serviço' value={servico} onChange={e=>setServico(e.target.value)} />
          <input type='datetime-local' style={{ padding:12, borderRadius:12, border:'1px solid #e5e7eb' }} value={dataHorario} onChange={e=>setDataHorario(e.target.value)} />
          <button onClick={adicionarAgendamento} style={{ padding:12, borderRadius:16, background:'#2563eb', color:'#fff', border:'none' }}>Adicionar Agendamento</button>
        </div>
      </div>

      <div style={{ width:'100%', maxWidth:720, display:'flex', flexDirection:'column', gap:12 }}>
        {agendamentos.map(ag => (
          <div key={ag.id} style={{ background:'#fff', padding:12, borderRadius:16, boxShadow:'0 6px 18px rgba(0,0,0,0.04)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div>
              <div style={{ fontWeight:600 }}>{ag.nomeCliente}</div>
              <div>{ag.servico}</div>
              <div style={{ color:'#6b7280', fontSize:13 }}>{new Date(ag.dataHorario).toLocaleString()}</div>
            </div>
            <div>
              <button onClick={()=>removerAgendamento(ag.id)} style={{ padding:8, borderRadius:10, background:'#ef4444', color:'#fff', border:'none' }}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
