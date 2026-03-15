export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      adiantamentos: {
        Row: {
          aprovado_por: string
          created_at: string
          data: string
          id: string
          mes_desconto: string
          motivo: string | null
          profissional: string
          status: string
          updated_at: string
          valor_aprovado: number
          valor_solicitado: number
        }
        Insert: {
          aprovado_por?: string
          created_at?: string
          data?: string
          id?: string
          mes_desconto: string
          motivo?: string | null
          profissional: string
          status?: string
          updated_at?: string
          valor_aprovado?: number
          valor_solicitado?: number
        }
        Update: {
          aprovado_por?: string
          created_at?: string
          data?: string
          id?: string
          mes_desconto?: string
          motivo?: string | null
          profissional?: string
          status?: string
          updated_at?: string
          valor_aprovado?: number
          valor_solicitado?: number
        }
        Relationships: []
      }
      agendamentos: {
        Row: {
          canal: string | null
          cliente_id: string | null
          cliente_nome: string
          created_at: string
          data: string
          duracao: number
          hora: string
          id: string
          observacoes: string | null
          profissional_id: string | null
          profissional_nome: string
          servico: string
          status: string
          updated_at: string
        }
        Insert: {
          canal?: string | null
          cliente_id?: string | null
          cliente_nome: string
          created_at?: string
          data: string
          duracao: number
          hora: string
          id?: string
          observacoes?: string | null
          profissional_id?: string | null
          profissional_nome: string
          servico: string
          status?: string
          updated_at?: string
        }
        Update: {
          canal?: string | null
          cliente_id?: string | null
          cliente_nome?: string
          created_at?: string
          data?: string
          duracao?: number
          hora?: string
          id?: string
          observacoes?: string | null
          profissional_id?: string | null
          profissional_nome?: string
          servico?: string
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "agendamentos_cliente_id_fkey"
            columns: ["cliente_id"]
            isOneToOne: false
            referencedRelation: "clientes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "agendamentos_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      clientes: {
        Row: {
          bi: string | null
          created_at: string
          data_nascimento: string | null
          email: string | null
          genero: string | null
          id: string
          nome_completo: string
          observacoes: string | null
          pontos: number | null
          profissao: string | null
          status: string
          telefone: string | null
          total_gasto: number | null
          updated_at: string
          visitas: number | null
        }
        Insert: {
          bi?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          genero?: string | null
          id?: string
          nome_completo: string
          observacoes?: string | null
          pontos?: number | null
          profissao?: string | null
          status?: string
          telefone?: string | null
          total_gasto?: number | null
          updated_at?: string
          visitas?: number | null
        }
        Update: {
          bi?: string | null
          created_at?: string
          data_nascimento?: string | null
          email?: string | null
          genero?: string | null
          id?: string
          nome_completo?: string
          observacoes?: string | null
          pontos?: number | null
          profissao?: string | null
          status?: string
          telefone?: string | null
          total_gasto?: number | null
          updated_at?: string
          visitas?: number | null
        }
        Relationships: []
      }
      contas_pagar: {
        Row: {
          categoria: string
          created_at: string
          data_pagamento: string | null
          descricao: string
          forma_pgto: string | null
          fornecedor_beneficiario: string
          id: string
          recorrencia: string | null
          status: string
          updated_at: string
          valor: number
          vencimento: string
        }
        Insert: {
          categoria: string
          created_at?: string
          data_pagamento?: string | null
          descricao: string
          forma_pgto?: string | null
          fornecedor_beneficiario: string
          id?: string
          recorrencia?: string | null
          status?: string
          updated_at?: string
          valor?: number
          vencimento: string
        }
        Update: {
          categoria?: string
          created_at?: string
          data_pagamento?: string | null
          descricao?: string
          forma_pgto?: string | null
          fornecedor_beneficiario?: string
          id?: string
          recorrencia?: string | null
          status?: string
          updated_at?: string
          valor?: number
          vencimento?: string
        }
        Relationships: []
      }
      contas_receber: {
        Row: {
          cliente: string
          created_at: string
          data_servico: string | null
          id: string
          observacoes: string | null
          servico: string
          status: string
          updated_at: string
          valor_pago: number
          valor_total: number
          vencimento: string
        }
        Insert: {
          cliente: string
          created_at?: string
          data_servico?: string | null
          id?: string
          observacoes?: string | null
          servico: string
          status?: string
          updated_at?: string
          valor_pago?: number
          valor_total?: number
          vencimento: string
        }
        Update: {
          cliente?: string
          created_at?: string
          data_servico?: string | null
          id?: string
          observacoes?: string | null
          servico?: string
          status?: string
          updated_at?: string
          valor_pago?: number
          valor_total?: number
          vencimento?: string
        }
        Relationships: []
      }
      contas_receber_pagamentos: {
        Row: {
          conta_receber_id: string
          created_at: string
          data: string
          forma: string
          id: string
          valor: number
        }
        Insert: {
          conta_receber_id: string
          created_at?: string
          data?: string
          forma?: string
          id?: string
          valor?: number
        }
        Update: {
          conta_receber_id?: string
          created_at?: string
          data?: string
          forma?: string
          id?: string
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "contas_receber_pagamentos_conta_receber_id_fkey"
            columns: ["conta_receber_id"]
            isOneToOne: false
            referencedRelation: "contas_receber"
            referencedColumns: ["id"]
          },
        ]
      }
      despesas: {
        Row: {
          categoria: string
          comprovante: string | null
          created_at: string
          data: string
          descricao: string
          forma_pgto: string
          fornecedor: string | null
          id: string
          nr_fatura: string | null
          recorrencia: string
          registrado_por: string
          updated_at: string
          valor: number
        }
        Insert: {
          categoria: string
          comprovante?: string | null
          created_at?: string
          data?: string
          descricao: string
          forma_pgto?: string
          fornecedor?: string | null
          id?: string
          nr_fatura?: string | null
          recorrencia?: string
          registrado_por?: string
          updated_at?: string
          valor?: number
        }
        Update: {
          categoria?: string
          comprovante?: string | null
          created_at?: string
          data?: string
          descricao?: string
          forma_pgto?: string
          fornecedor?: string | null
          id?: string
          nr_fatura?: string | null
          recorrencia?: string
          registrado_por?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      estabelecimentos: {
        Row: {
          ativo: boolean
          cor_primaria: string | null
          created_at: string
          id: string
          logo_url: string | null
          nome: string
          owner_user_id: string
          plano: string
          slug: string
          trial_expires_at: string | null
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          cor_primaria?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nome: string
          owner_user_id: string
          plano?: string
          slug: string
          trial_expires_at?: string | null
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          cor_primaria?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          nome?: string
          owner_user_id?: string
          plano?: string
          slug?: string
          trial_expires_at?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      estoque: {
        Row: {
          categoria: string
          created_at: string
          custo_unit: number
          estoque_atual: number
          fornecedor: string | null
          id: string
          minimo: number
          nota_fiscal: string | null
          produto: string
          updated_at: string
          validade: string | null
        }
        Insert: {
          categoria: string
          created_at?: string
          custo_unit?: number
          estoque_atual?: number
          fornecedor?: string | null
          id?: string
          minimo?: number
          nota_fiscal?: string | null
          produto: string
          updated_at?: string
          validade?: string | null
        }
        Update: {
          categoria?: string
          created_at?: string
          custo_unit?: number
          estoque_atual?: number
          fornecedor?: string | null
          id?: string
          minimo?: number
          nota_fiscal?: string | null
          produto?: string
          updated_at?: string
          validade?: string | null
        }
        Relationships: []
      }
      estoque_movimentacoes: {
        Row: {
          created_at: string
          custo_unit: number | null
          estoque_id: string
          fornecedor: string | null
          id: string
          nota_fiscal: string | null
          quantidade: number
          registrado_por: string
          tipo: string
        }
        Insert: {
          created_at?: string
          custo_unit?: number | null
          estoque_id: string
          fornecedor?: string | null
          id?: string
          nota_fiscal?: string | null
          quantidade?: number
          registrado_por?: string
          tipo?: string
        }
        Update: {
          created_at?: string
          custo_unit?: number | null
          estoque_id?: string
          fornecedor?: string | null
          id?: string
          nota_fiscal?: string | null
          quantidade?: number
          registrado_por?: string
          tipo?: string
        }
        Relationships: [
          {
            foreignKeyName: "estoque_movimentacoes_estoque_id_fkey"
            columns: ["estoque_id"]
            isOneToOne: false
            referencedRelation: "estoque"
            referencedColumns: ["id"]
          },
        ]
      }
      fechamentos_caixa: {
        Row: {
          created_at: string
          data: string
          descontos: number
          fechado: boolean
          fechado_por: string | null
          hora_fechamento: string | null
          id: string
          receita_produtos: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          data?: string
          descontos?: number
          fechado?: boolean
          fechado_por?: string | null
          hora_fechamento?: string | null
          id?: string
          receita_produtos?: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          data?: string
          descontos?: number
          fechado?: boolean
          fechado_por?: string | null
          hora_fechamento?: string | null
          id?: string
          receita_produtos?: number
          updated_at?: string
        }
        Relationships: []
      }
      fornecedor_compras: {
        Row: {
          created_at: string
          data: string
          descricao: string
          fornecedor_id: string
          id: string
          pago: number
          valor: number
        }
        Insert: {
          created_at?: string
          data?: string
          descricao: string
          fornecedor_id: string
          id?: string
          pago?: number
          valor?: number
        }
        Update: {
          created_at?: string
          data?: string
          descricao?: string
          fornecedor_id?: string
          id?: string
          pago?: number
          valor?: number
        }
        Relationships: [
          {
            foreignKeyName: "fornecedor_compras_fornecedor_id_fkey"
            columns: ["fornecedor_id"]
            isOneToOne: false
            referencedRelation: "fornecedores"
            referencedColumns: ["id"]
          },
        ]
      }
      fornecedores: {
        Row: {
          categoria: string
          contato: string
          created_at: string
          email: string | null
          endereco: string | null
          id: string
          nif: string | null
          nome: string
          nome_contato: string | null
          observacoes: string | null
          saldo_devedor: number
          ultima_compra: string | null
          updated_at: string
        }
        Insert: {
          categoria: string
          contato: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nif?: string | null
          nome: string
          nome_contato?: string | null
          observacoes?: string | null
          saldo_devedor?: number
          ultima_compra?: string | null
          updated_at?: string
        }
        Update: {
          categoria?: string
          contato?: string
          created_at?: string
          email?: string | null
          endereco?: string | null
          id?: string
          nif?: string | null
          nome?: string
          nome_contato?: string | null
          observacoes?: string | null
          saldo_devedor?: number
          ultima_compra?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      movimentacoes: {
        Row: {
          beneficiario_origem: string | null
          categoria: string
          created_at: string
          data: string
          descricao: string
          forma_pgto: string
          hora: string
          id: string
          observacoes: string | null
          referencia: string | null
          registrado_por: string
          tipo: string
          updated_at: string
          valor: number
        }
        Insert: {
          beneficiario_origem?: string | null
          categoria: string
          created_at?: string
          data?: string
          descricao: string
          forma_pgto?: string
          hora?: string
          id?: string
          observacoes?: string | null
          referencia?: string | null
          registrado_por?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Update: {
          beneficiario_origem?: string | null
          categoria?: string
          created_at?: string
          data?: string
          descricao?: string
          forma_pgto?: string
          hora?: string
          id?: string
          observacoes?: string | null
          referencia?: string | null
          registrado_por?: string
          tipo?: string
          updated_at?: string
          valor?: number
        }
        Relationships: []
      }
      produtos_vendidos: {
        Row: {
          categoria: string
          created_at: string
          custo: number
          id: string
          nome: string
          preco: number
          unidades: number
          updated_at: string
        }
        Insert: {
          categoria: string
          created_at?: string
          custo?: number
          id?: string
          nome: string
          preco?: number
          unidades?: number
          updated_at?: string
        }
        Update: {
          categoria?: string
          created_at?: string
          custo?: number
          id?: string
          nome?: string
          preco?: number
          unidades?: number
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          ativo: boolean
          created_at: string
          email: string | null
          estabelecimento_id: string | null
          id: string
          nome: string
          profissional_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          estabelecimento_id?: string | null
          id?: string
          nome: string
          profissional_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ativo?: boolean
          created_at?: string
          email?: string | null
          estabelecimento_id?: string | null
          id?: string
          nome?: string
          profissional_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_estabelecimento_id_fkey"
            columns: ["estabelecimento_id"]
            isOneToOne: false
            referencedRelation: "estabelecimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      profissionais: {
        Row: {
          cargo: string | null
          cor: string | null
          created_at: string
          emoji: string | null
          foto_url: string | null
          id: string
          nome: string
          servicos: string[] | null
          status: string
          updated_at: string
        }
        Insert: {
          cargo?: string | null
          cor?: string | null
          created_at?: string
          emoji?: string | null
          foto_url?: string | null
          id?: string
          nome: string
          servicos?: string[] | null
          status?: string
          updated_at?: string
        }
        Update: {
          cargo?: string | null
          cor?: string | null
          created_at?: string
          emoji?: string | null
          foto_url?: string | null
          id?: string
          nome?: string
          servicos?: string[] | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      salarios_config: {
        Row: {
          atendimentos_mes: number
          comissao_pct: number
          created_at: string
          fixo: number
          id: string
          profissional: string
          profissional_id: string | null
          receita_gerada_mes: number
          tipo: string
          updated_at: string
        }
        Insert: {
          atendimentos_mes?: number
          comissao_pct?: number
          created_at?: string
          fixo?: number
          id?: string
          profissional: string
          profissional_id?: string | null
          receita_gerada_mes?: number
          tipo?: string
          updated_at?: string
        }
        Update: {
          atendimentos_mes?: number
          comissao_pct?: number
          created_at?: string
          fixo?: number
          id?: string
          profissional?: string
          profissional_id?: string | null
          receita_gerada_mes?: number
          tipo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "salarios_config_profissional_id_fkey"
            columns: ["profissional_id"]
            isOneToOne: false
            referencedRelation: "profissionais"
            referencedColumns: ["id"]
          },
        ]
      }
      servicos: {
        Row: {
          ativo: boolean
          categoria: string
          created_at: string
          duracao: number
          id: string
          nome: string
          preco: number
          updated_at: string
        }
        Insert: {
          ativo?: boolean
          categoria: string
          created_at?: string
          duracao: number
          id?: string
          nome: string
          preco: number
          updated_at?: string
        }
        Update: {
          ativo?: boolean
          categoria?: string
          created_at?: string
          duracao?: number
          id?: string
          nome?: string
          preco?: number
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "financeiro" | "colaborador" | "super_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "financeiro", "colaborador", "super_admin"],
    },
  },
} as const
