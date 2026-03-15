import { useState } from "react";
import { Modal, InputField, SelectField, TextareaField } from "./FinanceiroUI";
import { categoriasDespesa } from "@/data/financeiroData";
import type { Movimentacao, ContaPagar, ContaReceber, Despesa, Fornecedor, Adiantamento } from "@/hooks/useFinanceiroData";

// ===== FORM ENTRADA/SAÍDA =====
export function FormEntradaSaida({ 
  tipo, 
  onSave, 
  registradoPor 
}: { 
  tipo: "Entrada" | "Saída"; 
  onSave: (m: Omit<Movimentacao, "id">) => void;
  registradoPor: string;
}) {
  const [f, setF] = useState({ 
    descricao: "", valor: "", 
    categoria: tipo === "Entrada" ? "Serviço" : "Despesa Operacional", 
    formaPgto: "Dinheiro" as const, beneficiario: "", obs: "" 
  });
  
  const catEntrada = [
    { value: "Serviço", label: "Serviço" }, 
    { value: "Venda de Produto", label: "Venda de Produto" }, 
    { value: "Outros", label: "Outros" }
  ];
  const catSaida = [
    { value: "Despesa Operacional", label: "Despesa Operacional" }, 
    { value: "Fornecedor", label: "Fornecedor" }, 
    { value: "Salário", label: "Salário" }, 
    { value: "Adiantamento", label: "Adiantamento" }, 
    { value: "Comissão", label: "Comissão" }, 
    { value: "Outros", label: "Outros" }
  ];

  const isValid = f.descricao.trim() && Number(f.valor) > 0;

  return (
    <div className="space-y-3">
      <InputField label="Descrição" value={f.descricao} onChange={v => setF(p => ({ ...p, descricao: v }))} required />
      <InputField label="Valor (Kz)" value={f.valor} onChange={v => setF(p => ({ ...p, valor: v }))} type="number" required />
      <SelectField label="Categoria" value={f.categoria} onChange={v => setF(p => ({ ...p, categoria: v }))} options={tipo === "Entrada" ? catEntrada : catSaida} />
      <SelectField label="Forma de pagamento" value={f.formaPgto} onChange={v => setF(p => ({ ...p, formaPgto: v as any }))} options={[
        { value: "Dinheiro", label: "Dinheiro" }, 
        { value: "Transferência", label: "Transferência" }, 
        { value: "TPA", label: "TPA (Cartão)" }
      ]} />
      <InputField label="Beneficiário / Origem" value={f.beneficiario} onChange={v => setF(p => ({ ...p, beneficiario: v }))} />
      <TextareaField label="Observações" value={f.obs} onChange={v => setF(p => ({ ...p, obs: v }))} rows={2} />
      <button 
        disabled={!isValid} 
        onClick={() => onSave({ 
          data: new Date().toISOString().slice(0, 10), 
          hora: new Date().toTimeString().slice(0, 5), 
          descricao: f.descricao, categoria: f.categoria, tipo, 
          valor: Number(f.valor), formaPgto: f.formaPgto, registradoPor, 
          beneficiarioOrigem: f.beneficiario, observacoes: f.obs 
        })}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Registrar {tipo}
      </button>
    </div>
  );
}

// ===== FORM CONTA A PAGAR =====
export function FormContaPagar({ onSave }: { onSave: (c: Omit<ContaPagar, "id">) => void }) {
  const [f, setF] = useState({ 
    fornecedor: "", descricao: "", categoria: "Aluguel", 
    valor: "", vencimento: "", recorrencia: "Única" as const 
  });
  
  const cats = ["Aluguel", "Utilidades", "Internet", "Fornecedor", "Equipamento", "Administrativo", "Outros"].map(v => ({ value: v, label: v }));
  const isValid = f.fornecedor.trim() && f.descricao.trim() && Number(f.valor) > 0 && f.vencimento;

  return (
    <div className="space-y-3">
      <InputField label="Fornecedor/Beneficiário" value={f.fornecedor} onChange={v => setF(p => ({ ...p, fornecedor: v }))} required />
      <InputField label="Descrição" value={f.descricao} onChange={v => setF(p => ({ ...p, descricao: v }))} required />
      <SelectField label="Categoria" value={f.categoria} onChange={v => setF(p => ({ ...p, categoria: v }))} options={cats} />
      <InputField label="Valor (Kz)" value={f.valor} onChange={v => setF(p => ({ ...p, valor: v }))} type="number" required />
      <InputField label="Data de vencimento" value={f.vencimento} onChange={v => setF(p => ({ ...p, vencimento: v }))} type="date" required />
      <SelectField label="Recorrência" value={f.recorrencia} onChange={v => setF(p => ({ ...p, recorrencia: v as any }))} options={[
        { value: "Única", label: "Única" }, { value: "Mensal", label: "Mensal" }, { value: "Trimestral", label: "Trimestral" }
      ]} />
      <button 
        disabled={!isValid} 
        onClick={() => onSave({ 
          fornecedorBeneficiario: f.fornecedor, descricao: f.descricao, 
          categoria: f.categoria, valor: Number(f.valor), vencimento: f.vencimento, 
          status: "Pendente", recorrencia: f.recorrencia 
        })}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Registrar Conta
      </button>
    </div>
  );
}

// ===== FORM PAGAR CONTA =====
export function FormPagarConta({ 
  conta, format, onSave 
}: { 
  conta: ContaPagar; format: (v: number) => string; 
  onSave: (dataPgto: string, formaPgto: string) => void 
}) {
  const [f, setF] = useState({ dataPagamento: new Date().toISOString().slice(0, 10), formaPgto: "Transferência" });

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-surface2 p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-text3">Beneficiário:</span><span className="font-medium text-foreground">{conta.fornecedorBeneficiario}</span></div>
        <div className="flex justify-between text-sm"><span className="text-text3">Descrição:</span><span className="text-foreground">{conta.descricao}</span></div>
        <div className="flex justify-between text-sm"><span className="text-text3">Valor:</span><span className="font-bold text-foreground">{format(conta.valor)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-text3">Vencimento:</span><span className={conta.status === "Vencida" ? "text-destructive font-medium" : "text-foreground"}>{conta.vencimento}</span></div>
      </div>
      <InputField label="Data do pagamento" value={f.dataPagamento} onChange={v => setF(p => ({ ...p, dataPagamento: v }))} type="date" required />
      <SelectField label="Forma de pagamento" value={f.formaPgto} onChange={v => setF(p => ({ ...p, formaPgto: v }))} options={[
        { value: "Dinheiro", label: "Dinheiro" }, { value: "Transferência", label: "Transferência" }, { value: "TPA", label: "TPA (Cartão)" }
      ]} />
      <button onClick={() => onSave(f.dataPagamento, f.formaPgto)} className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground">
        Confirmar Pagamento
      </button>
    </div>
  );
}

// ===== FORM FIADO =====
export function FormFiado({ onSave }: { onSave: (c: Omit<ContaReceber, "id">) => void }) {
  const [f, setF] = useState({ cliente: "", servico: "", valorTotal: "", valorPago: "", vencimento: "", obs: "" });
  const isValid = f.cliente.trim() && f.servico.trim() && Number(f.valorTotal) > 0 && f.vencimento;

  return (
    <div className="space-y-3">
      <InputField label="Cliente" value={f.cliente} onChange={v => setF(p => ({ ...p, cliente: v }))} required />
      <InputField label="Serviço realizado" value={f.servico} onChange={v => setF(p => ({ ...p, servico: v }))} required />
      <InputField label="Valor total (Kz)" value={f.valorTotal} onChange={v => setF(p => ({ ...p, valorTotal: v }))} type="number" required />
      <InputField label="Entrada/sinal pago (Kz)" value={f.valorPago} onChange={v => setF(p => ({ ...p, valorPago: v }))} type="number" />
      <InputField label="Data de vencimento" value={f.vencimento} onChange={v => setF(p => ({ ...p, vencimento: v }))} type="date" required />
      <TextareaField label="Observações / acordo" value={f.obs} onChange={v => setF(p => ({ ...p, obs: v }))} rows={2} />
      <button 
        disabled={!isValid} 
        onClick={() => { 
          const pago = Number(f.valorPago) || 0; 
          onSave({ 
            cliente: f.cliente, servico: f.servico, valorTotal: Number(f.valorTotal), 
            valorPago: pago, vencimento: f.vencimento, 
            status: pago > 0 ? "Parcialmente pago" : "Em aberto", 
            dataServico: new Date().toISOString().slice(0, 10), observacoes: f.obs,
            historicoPagamentos: pago > 0 ? [{ data: new Date().toISOString().slice(0, 10), valor: pago, forma: "Dinheiro" }] : [],
          }); 
        }}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Registrar Fiado
      </button>
    </div>
  );
}

// ===== FORM PAGAMENTO FIADO =====
export function FormPagamentoFiado({ conta, format, onSave }: { 
  conta: ContaReceber; format: (v: number) => string; 
  onSave: (valor: number, formaPgto: string) => void 
}) {
  const [f, setF] = useState({ valor: "", formaPgto: "Dinheiro" });
  const saldo = conta.valorTotal - conta.valorPago;
  const isValid = Number(f.valor) > 0;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-surface2 p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-text3">Valor total:</span><span className="text-foreground">{format(conta.valorTotal)}</span></div>
        <div className="flex justify-between text-sm"><span className="text-text3">Já pago:</span><span className="text-green-custom">{format(conta.valorPago)}</span></div>
        <div className="flex justify-between text-sm font-bold border-t border-border pt-2"><span>Saldo devedor:</span><span className="text-destructive">{format(saldo)}</span></div>
      </div>
      {conta.historicoPagamentos && conta.historicoPagamentos.length > 0 && (
        <div>
          <p className="text-xs text-text3 mb-2 font-medium">Histórico de pagamentos</p>
          <div className="space-y-1 max-h-32 overflow-y-auto">
            {conta.historicoPagamentos.map((h, i) => (
              <div key={i} className="flex justify-between text-xs bg-surface2 rounded px-3 py-2">
                <span className="text-text3">{h.data}</span><span className="font-medium">{format(h.valor)}</span><span className="text-text3">{h.forma}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <InputField label="Valor recebido (Kz)" value={f.valor} onChange={v => setF(p => ({ ...p, valor: v }))} type="number" required />
      <SelectField label="Forma de recebimento" value={f.formaPgto} onChange={v => setF(p => ({ ...p, formaPgto: v }))} options={[
        { value: "Dinheiro", label: "Dinheiro" }, { value: "Transferência", label: "Transferência" }, { value: "TPA", label: "TPA (Cartão)" }
      ]} />
      <button disabled={!isValid} onClick={() => onSave(Number(f.valor), f.formaPgto)}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed">
        Registrar Pagamento
      </button>
    </div>
  );
}

// ===== FORM DESPESA =====
export function FormDespesa({ onSave, registradoPor }: { onSave: (d: Omit<Despesa, "id">) => void; registradoPor: string }) {
  const [f, setF] = useState({ 
    descricao: "", categoria: "Aluguel", fornecedor: "", valor: "", 
    data: new Date().toISOString().slice(0, 10), formaPgto: "Dinheiro", nrFatura: "", recorrencia: "Única" as const 
  });
  const isValid = f.descricao.trim() && Number(f.valor) > 0;

  return (
    <div className="space-y-3">
      <InputField label="Descrição" value={f.descricao} onChange={v => setF(p => ({ ...p, descricao: v }))} required />
      <SelectField label="Categoria" value={f.categoria} onChange={v => setF(p => ({ ...p, categoria: v }))} options={categoriasDespesa.map(c => ({ value: c.key, label: `${c.icon} ${c.label}` }))} />
      <InputField label="Fornecedor" value={f.fornecedor} onChange={v => setF(p => ({ ...p, fornecedor: v }))} />
      <InputField label="Valor (Kz)" value={f.valor} onChange={v => setF(p => ({ ...p, valor: v }))} type="number" required />
      <InputField label="Data" value={f.data} onChange={v => setF(p => ({ ...p, data: v }))} type="date" />
      <SelectField label="Forma de pagamento" value={f.formaPgto} onChange={v => setF(p => ({ ...p, formaPgto: v }))} options={[
        { value: "Dinheiro", label: "Dinheiro" }, { value: "Transferência", label: "Transferência" }, { value: "TPA", label: "TPA (Cartão)" }
      ]} />
      <InputField label="Nº fatura/recibo" value={f.nrFatura} onChange={v => setF(p => ({ ...p, nrFatura: v }))} />
      <SelectField label="Recorrência" value={f.recorrencia} onChange={v => setF(p => ({ ...p, recorrencia: v as any }))} options={[
        { value: "Única", label: "Única" }, { value: "Mensal", label: "Mensal" }
      ]} />
      <button disabled={!isValid} onClick={() => onSave({ 
        descricao: f.descricao, categoria: f.categoria, fornecedor: f.fornecedor, 
        valor: Number(f.valor), data: f.data, formaPgto: f.formaPgto, registradoPor, 
        recorrencia: f.recorrencia, nrFatura: f.nrFatura 
      })}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed">
        Registrar Despesa
      </button>
    </div>
  );
}

// ===== FORM FORNECEDOR =====
export function FormFornecedor({ onSave }: { onSave: (f: Omit<Fornecedor, "id">) => void }) {
  const [f, setF] = useState({ nome: "", categoria: "Produtos capilares", contato: "", email: "", endereco: "", nif: "", nomeContato: "", obs: "" });
  const cats = ["Produtos capilares", "Cosméticos", "Equipamentos", "Materiais de limpeza", "Outros"].map(v => ({ value: v, label: v }));
  const isValid = f.nome.trim() && f.contato.trim();

  return (
    <div className="space-y-3">
      <InputField label="Nome da empresa" value={f.nome} onChange={v => setF(p => ({ ...p, nome: v }))} required />
      <SelectField label="Categoria" value={f.categoria} onChange={v => setF(p => ({ ...p, categoria: v }))} options={cats} />
      <InputField label="Nome do contacto" value={f.nomeContato} onChange={v => setF(p => ({ ...p, nomeContato: v }))} />
      <InputField label="Telefone / WhatsApp" value={f.contato} onChange={v => setF(p => ({ ...p, contato: v }))} required />
      <InputField label="E-mail" value={f.email} onChange={v => setF(p => ({ ...p, email: v }))} type="email" />
      <InputField label="Endereço" value={f.endereco} onChange={v => setF(p => ({ ...p, endereco: v }))} />
      <InputField label="NIF" value={f.nif} onChange={v => setF(p => ({ ...p, nif: v }))} />
      <TextareaField label="Observações" value={f.obs} onChange={v => setF(p => ({ ...p, obs: v }))} rows={2} />
      <button disabled={!isValid} onClick={() => onSave({ 
        nome: f.nome, categoria: f.categoria, contato: f.contato, nif: f.nif, 
        saldoDevedor: 0, ultimaCompra: "—", email: f.email, endereco: f.endereco, 
        nomeContato: f.nomeContato, observacoes: f.obs 
      })}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed">
        Cadastrar Fornecedor
      </button>
    </div>
  );
}

// ===== FORM COMPRA FORNECEDOR =====
export function FormCompraFornecedor({ 
  fornecedores, format, onSave 
}: { 
  fornecedores: Fornecedor[]; format: (v: number) => string;
  onSave: (fornecedorId: string, descricao: string, valorTotal: number, valorPago: number) => void 
}) {
  const [f, setF] = useState({ 
    fornecedorId: fornecedores[0]?.id || "", descricao: "", 
    valorTotal: "", valorPago: "", formaPgto: "Transferência", nrFatura: "" 
  });
  const saldoEmDivida = (Number(f.valorTotal) || 0) - (Number(f.valorPago) || 0);
  const isValid = f.fornecedorId && f.descricao.trim() && Number(f.valorTotal) > 0;

  return (
    <div className="space-y-3">
      <SelectField label="Fornecedor" value={f.fornecedorId} onChange={v => setF(p => ({ ...p, fornecedorId: v }))} options={fornecedores.map(f => ({ value: f.id, label: f.nome }))} required />
      <InputField label="Descrição da compra" value={f.descricao} onChange={v => setF(p => ({ ...p, descricao: v }))} required />
      <InputField label="Valor total (Kz)" value={f.valorTotal} onChange={v => setF(p => ({ ...p, valorTotal: v }))} type="number" required />
      <InputField label="Valor pago agora (Kz)" value={f.valorPago} onChange={v => setF(p => ({ ...p, valorPago: v }))} type="number" />
      <div className="rounded-lg bg-surface2 p-3 text-sm flex justify-between">
        <span className="text-text3">Saldo em dívida:</span>
        <span className={`font-bold ${saldoEmDivida > 0 ? "text-destructive" : "text-green-custom"}`}>{format(saldoEmDivida)}</span>
      </div>
      <SelectField label="Forma de pagamento" value={f.formaPgto} onChange={v => setF(p => ({ ...p, formaPgto: v }))} options={[
        { value: "Dinheiro", label: "Dinheiro" }, { value: "Transferência", label: "Transferência" }, { value: "TPA", label: "TPA (Cartão)" }
      ]} />
      <InputField label="Nº da fatura" value={f.nrFatura} onChange={v => setF(p => ({ ...p, nrFatura: v }))} />
      <button disabled={!isValid} onClick={() => onSave(f.fornecedorId, f.descricao, Number(f.valorTotal), Number(f.valorPago) || 0)}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed">
        Registrar Compra
      </button>
    </div>
  );
}

// ===== FORM ADIANTAMENTO =====
export function FormAdiantamento({ 
  profissionais, aprovadoPor, onSave 
}: { 
  profissionais: string[]; aprovadoPor: string; 
  onSave: (a: Omit<Adiantamento, "id">) => void 
}) {
  const [f, setF] = useState({ profissional: profissionais[0] || "", valorSolicitado: "", valorAprovado: "", mesDesconto: "", motivo: "" });
  const isValid = f.profissional && Number(f.valorSolicitado) > 0 && f.mesDesconto.trim();

  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(); d.setMonth(d.getMonth() + i);
    const label = d.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });
    return { value: label.charAt(0).toUpperCase() + label.slice(1), label: label.charAt(0).toUpperCase() + label.slice(1) };
  });

  return (
    <div className="space-y-3">
      <SelectField label="Colaborador" value={f.profissional} onChange={v => setF(p => ({ ...p, profissional: v }))} options={profissionais.map(p => ({ value: p, label: p }))} required />
      <InputField label="Valor solicitado (Kz)" value={f.valorSolicitado} onChange={v => setF(p => ({ ...p, valorSolicitado: v }))} type="number" required />
      <InputField label="Valor aprovado (Kz)" value={f.valorAprovado} onChange={v => setF(p => ({ ...p, valorAprovado: v }))} type="number" placeholder="Deixe vazio para aprovar o valor solicitado" />
      <SelectField label="Mês de desconto" value={f.mesDesconto} onChange={v => setF(p => ({ ...p, mesDesconto: v }))} options={meses} required />
      <TextareaField label="Motivo" value={f.motivo} onChange={v => setF(p => ({ ...p, motivo: v }))} rows={2} />
      <button disabled={!isValid} onClick={() => onSave({ 
        profissional: f.profissional, valorSolicitado: Number(f.valorSolicitado), 
        valorAprovado: Number(f.valorAprovado) || Number(f.valorSolicitado), 
        data: new Date().toISOString().slice(0, 10), mesDesconto: f.mesDesconto, 
        status: "Pendente aprovação", aprovadoPor: "", motivo: f.motivo 
      })}
        className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed">
        Solicitar Adiantamento
      </button>
    </div>
  );
}

// ===== FORM SALÁRIO =====
export function FormPagarSalario({ 
  profissional, fixo, comissao, adiantamentos, format, onSave 
}: { 
  profissional: string; fixo: number; comissao: number; adiantamentos: number; 
  format: (v: number) => string; onSave: () => void;
}) {
  const [f, setF] = useState({ dataPgto: new Date().toISOString().slice(0, 10), formaPgto: "Transferência", obs: "" });
  const total = fixo + comissao - adiantamentos;

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-surface2 p-4 space-y-2">
        <div className="flex justify-between text-sm"><span className="text-text3">Profissional:</span><span className="font-medium text-foreground">{profissional}</span></div>
        <div className="border-t border-border pt-2 space-y-1">
          <div className="flex justify-between text-sm"><span className="text-text3">Salário base:</span><span className="text-foreground">{format(fixo)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text3">Comissão:</span><span className="text-green-custom">+{format(comissao)}</span></div>
          <div className="flex justify-between text-sm"><span className="text-text3">Adiantamentos:</span><span className="text-destructive">-{format(adiantamentos)}</span></div>
        </div>
        <div className="border-t border-border pt-2 flex justify-between font-bold text-lg"><span>Total líquido:</span><span className="text-foreground">{format(total)}</span></div>
      </div>
      <InputField label="Data do pagamento" value={f.dataPgto} onChange={v => setF(p => ({ ...p, dataPgto: v }))} type="date" />
      <SelectField label="Forma de pagamento" value={f.formaPgto} onChange={v => setF(p => ({ ...p, formaPgto: v }))} options={[
        { value: "Transferência", label: "Transferência" }, { value: "Dinheiro", label: "Dinheiro" }
      ]} />
      <TextareaField label="Observações" value={f.obs} onChange={v => setF(p => ({ ...p, obs: v }))} rows={2} />
      <button onClick={onSave} className="w-full rounded-lg gold-gradient px-4 py-2.5 text-sm font-semibold text-primary-foreground">
        Confirmar Pagamento
      </button>
    </div>
  );
}
