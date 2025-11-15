-- SQL para criar tabela no Supabase (Postgres)
CREATE TABLE IF NOT EXISTS public.agendamentos (
  id bigint PRIMARY KEY,
  nomeCliente text NOT NULL,
  servico text NOT NULL,
  dataHorario timestamptz NOT NULL DEFAULT NOW()
);
