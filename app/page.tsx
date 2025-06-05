"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import {
  LayoutDashboard,
  Pill,
  ArrowUpCircle,
  ArrowDownCircle,
  AlertTriangle,
  BarChart3,
  Settings,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Bell,
  Package,
  Calendar,
  TrendingDown,
  CheckCircle,
  XCircle,
  AlertCircle,
  X,
  Activity,
  Menu,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import type { ChartConfig } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts"

const inter = Inter({ subsets: ["latin"] })

// Types
interface Medication {
  id: number
  name: string
  lot: string
  expiry: string
  manufacturer: string
  category: string
  stock: number
}

interface Entry {
  id: number
  medication: string
  lot: string
  date: string
  supplier: string
  quantity: number
}

interface Exit {
  id: number
  medication: string
  date: string
  reason: string
  responsible: string
  quantity: number
  notes?: string
}

interface Notification {
  id: number
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
}

interface AppSettings {
  criticalThreshold: number
  lowThreshold: number
  expiryWarning: number
  expiryCritical: number
  emailNotifications: boolean
  whatsappNotifications: boolean
  dailySummary: boolean
  emailAddress: string
  whatsappNumber: string
}

// Sample data
const sampleMedications: Medication[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    lot: "LOT001",
    expiry: "2024-12-15",
    manufacturer: "PharmaCorp",
    category: "Analgésico",
    stock: 150,
  },
  {
    id: 2,
    name: "Amoxicilina 250mg",
    lot: "LOT002",
    expiry: "2024-08-20",
    manufacturer: "MediLab",
    category: "Antibiótico",
    stock: 25,
  },
  {
    id: 3,
    name: "Ibuprofeno 400mg",
    lot: "LOT003",
    expiry: "2025-03-10",
    manufacturer: "HealthGen",
    category: "Anti-inflamatório",
    stock: 80,
  },
  {
    id: 4,
    name: "Metformina 850mg",
    lot: "LOT004",
    expiry: "2024-09-05",
    manufacturer: "DiabetCare",
    category: "Antidiabético",
    stock: 5,
  },
  {
    id: 5,
    name: "Lisinopril 10mg",
    lot: "LOT005",
    expiry: "2025-01-30",
    manufacturer: "CardioMed",
    category: "Inibidor ECA",
    stock: 120,
  },
]

const sampleEntries: Entry[] = [
  {
    id: 1,
    medication: "Paracetamol 500mg",
    lot: "LOT001",
    date: "2024-06-01",
    supplier: "MedSupply Co.",
    quantity: 100,
  },
  {
    id: 2,
    medication: "Amoxicilina 250mg",
    lot: "LOT002",
    date: "2024-06-02",
    supplier: "PharmaDist",
    quantity: 50,
  },
  {
    id: 3,
    medication: "Ibuprofeno 400mg",
    lot: "LOT003",
    date: "2024-06-03",
    supplier: "HealthSource",
    quantity: 75,
  },
]

const sampleExits: Exit[] = [
  {
    id: 1,
    medication: "Paracetamol 500mg",
    date: "2024-06-04",
    reason: "Prescrição",
    responsible: "Dr. Silva",
    quantity: 10,
  },
  {
    id: 2,
    medication: "Amoxicilina 250mg",
    date: "2024-06-05",
    reason: "Transferência Hospitalar",
    responsible: "Enfermeira Santos",
    quantity: 25,
  },
  {
    id: 3,
    medication: "Ibuprofeno 400mg",
    date: "2024-06-06",
    reason: "Solicitação do Paciente",
    responsible: "Farmacêutico Costa",
    quantity: 5,
  },
]

// Chart configurations
const stockChartConfig = {
  stock: {
    label: "Estoque",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

const categoryChartConfig = {
  count: {
    label: "Quantidade",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const movementChartConfig = {
  entries: {
    label: "Entradas",
    color: "hsl(142, 76%, 36%)",
  },
  exits: {
    label: "Saídas",
    color: "hsl(346, 87%, 43%)",
  },
} satisfies ChartConfig

// Move these components outside the main component, before the export default function
const MedicationForm = React.memo(
  ({
    isEdit = false,
    medicationForm,
    setMedicationForm,
    onSubmit,
    onCancel,
  }: {
    isEdit?: boolean
    medicationForm: any
    setMedicationForm: (form: any) => void
    onSubmit: (e?: React.FormEvent) => void
    onCancel: () => void
  }) => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar Medicamento" : "Adicionar Novo Medicamento"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Atualize os detalhes do medicamento." : "Insira os detalhes do novo medicamento."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="ex: Paracetamol 500mg"
              value={medicationForm.name}
              onChange={(e) => setMedicationForm({ ...medicationForm, name: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lot">Número do Lote</Label>
            <Input
              id="lot"
              placeholder="ex: LOT001"
              value={medicationForm.lot}
              onChange={(e) => setMedicationForm({ ...medicationForm, lot: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="expiry">Data de Validade</Label>
            <Input
              id="expiry"
              type="date"
              value={medicationForm.expiry}
              onChange={(e) => setMedicationForm({ ...medicationForm, expiry: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="manufacturer">Fabricante</Label>
            <Input
              id="manufacturer"
              placeholder="ex: PharmaCorp"
              value={medicationForm.manufacturer}
              onChange={(e) => setMedicationForm({ ...medicationForm, manufacturer: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="category">Categoria</Label>
            <Select
              value={medicationForm.category}
              onValueChange={(value) => setMedicationForm({ ...medicationForm, category: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Analgésico">Analgésico</SelectItem>
                <SelectItem value="Antibiótico">Antibiótico</SelectItem>
                <SelectItem value="Anti-inflamatório">Anti-inflamatório</SelectItem>
                <SelectItem value="Antidiabético">Antidiabético</SelectItem>
                <SelectItem value="Inibidor ECA">Inibidor ECA</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="stock">Estoque</Label>
            <Input
              id="stock"
              type="number"
              placeholder="ex: 100"
              value={medicationForm.stock}
              onChange={(e) => setMedicationForm({ ...medicationForm, stock: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {isEdit ? "Atualizar Medicamento" : "Salvar Medicamento"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  ),
)

const EntryForm = React.memo(
  ({
    isEdit = false,
    entryForm,
    setEntryForm,
    medications,
    onSubmit,
    onCancel,
  }: {
    isEdit?: boolean
    entryForm: any
    setEntryForm: (form: any) => void
    medications: Medication[]
    onSubmit: (e?: React.FormEvent) => void
    onCancel: () => void
  }) => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar Entrada" : "Registrar Nova Entrada"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Atualize os detalhes da entrada." : "Registre uma nova entrada de estoque de medicamento."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="medication">Medicamento</Label>
            <Select
              value={entryForm.medication}
              onValueChange={(value) => setEntryForm({ ...entryForm, medication: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o medicamento" />
              </SelectTrigger>
              <SelectContent>
                {medications.map((med) => (
                  <SelectItem key={med.id} value={med.name}>
                    {med.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="lot">Número do Lote</Label>
            <Input
              id="lot"
              placeholder="ex: LOT001"
              value={entryForm.lot}
              onChange={(e) => setEntryForm({ ...entryForm, lot: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={entryForm.date}
              onChange={(e) => setEntryForm({ ...entryForm, date: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="supplier">Fornecedor</Label>
            <Input
              id="supplier"
              placeholder="ex: MedSupply Co."
              value={entryForm.supplier}
              onChange={(e) => setEntryForm({ ...entryForm, supplier: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="ex: 50"
              value={entryForm.quantity}
              onChange={(e) => setEntryForm({ ...entryForm, quantity: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {isEdit ? "Atualizar Entrada" : "Registrar Entrada"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  ),
)

const ExitForm = React.memo(
  ({
    isEdit = false,
    exitForm,
    setExitForm,
    medications,
    onSubmit,
    onCancel,
  }: {
    isEdit?: boolean
    exitForm: any
    setExitForm: (form: any) => void
    medications: Medication[]
    onSubmit: (e?: React.FormEvent) => void
    onCancel: () => void
  }) => (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>{isEdit ? "Editar Saída" : "Registrar Nova Saída"}</DialogTitle>
        <DialogDescription>
          {isEdit ? "Atualize os detalhes da saída." : "Registre uma nova saída de estoque de medicamento."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={onSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="medication">Medicamento</Label>
            <Select
              value={exitForm.medication}
              onValueChange={(value) => setExitForm({ ...exitForm, medication: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o medicamento" />
              </SelectTrigger>
              <SelectContent>
                {medications.map((med) => (
                  <SelectItem key={med.id} value={med.name}>
                    {med.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input
              id="quantity"
              type="number"
              placeholder="ex: 10"
              value={exitForm.quantity}
              onChange={(e) => setExitForm({ ...exitForm, quantity: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="reason">Motivo</Label>
            <Select value={exitForm.reason} onValueChange={(value) => setExitForm({ ...exitForm, reason: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Prescrição">Prescrição</SelectItem>
                <SelectItem value="Transferência Hospitalar">Transferência Hospitalar</SelectItem>
                <SelectItem value="Solicitação do Paciente">Solicitação do Paciente</SelectItem>
                <SelectItem value="Vencido">Vencido</SelectItem>
                <SelectItem value="Danificado">Danificado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="responsible">Responsável</Label>
            <Input
              id="responsible"
              placeholder="ex: Dr. Silva"
              value={exitForm.responsible}
              onChange={(e) => setExitForm({ ...exitForm, responsible: e.target.value })}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="notes">Observações (Opcional)</Label>
            <Textarea
              id="notes"
              placeholder="Observações adicionais..."
              value={exitForm.notes}
              onChange={(e) => setExitForm({ ...exitForm, notes: e.target.value })}
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
            {isEdit ? "Atualizar Saída" : "Registrar Saída"}
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  ),
)

// Desktop Sidebar Component
const Sidebar = ({ currentPage, setCurrentPage }: { currentPage: string; setCurrentPage: (page: string) => void }) => (
  <div className="w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0 z-10 hidden md:block">
    <div className="p-6">
      <div className="flex items-center gap-2 mb-8">
        <Pill className="h-8 w-8 text-blue-600" />
        <h1 className="text-xl font-bold text-gray-900">By Vida</h1>
      </div>

      <nav className="space-y-2">
        {[
          { id: "dashboard", label: "Painel", icon: LayoutDashboard },
          { id: "medications", label: "Medicamentos", icon: Pill },
          { id: "entries", label: "Entradas", icon: ArrowUpCircle },
          { id: "exits", label: "Saídas", icon: ArrowDownCircle },
          { id: "alerts", label: "Alertas", icon: AlertTriangle },
          { id: "monitoring", label: "Monitoramento", icon: BarChart3 },
          { id: "settings", label: "Configurações", icon: Settings },
        ].map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCurrentPage(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
              currentPage === item.id
                ? "bg-blue-50 text-blue-700 border border-blue-200"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>
    </div>
  </div>
)

// Mobile Navigation Component
const MobileNav = ({
  currentPage,
  setCurrentPage,
}: { currentPage: string; setCurrentPage: (page: string) => void }) => {
  const [open, setOpen] = useState(false)

  const navigationItems = [
    { id: "dashboard", label: "Painel", icon: LayoutDashboard },
    { id: "medications", label: "Medicamentos", icon: Pill },
    { id: "entries", label: "Entradas", icon: ArrowUpCircle },
    { id: "exits", label: "Saídas", icon: ArrowDownCircle },
    { id: "alerts", label: "Alertas", icon: AlertTriangle },
    { id: "monitoring", label: "Monitoramento", icon: BarChart3 },
    { id: "settings", label: "Configurações", icon: Settings },
  ]

  const handleNavigation = (pageId: string) => {
    setCurrentPage(pageId)
    setOpen(false)
  }

  return (
    <div className="md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="fixed top-4 left-4 z-50 bg-white shadow-md">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Abrir menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-64 p-0">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <SheetTitle className="flex items-center gap-2">
                <Pill className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">By Vida</span>
              </SheetTitle>
            </SheetHeader>

            <nav className="space-y-2">
              {navigationItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavigation(item.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    currentPage === item.id
                      ? "bg-blue-50 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

// Mobile Header Component
const MobileHeader = ({ currentPage }: { currentPage: string }) => {
  const getPageTitle = (page: string) => {
    switch (page) {
      case "dashboard":
        return "Painel"
      case "medications":
        return "Medicamentos"
      case "entries":
        return "Entradas"
      case "exits":
        return "Saídas"
      case "alerts":
        return "Alertas"
      case "monitoring":
        return "Monitoramento"
      case "settings":
        return "Configurações"
      default:
        return "By Vida"
    }
  }

  return (
    <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 mb-4">
      <div className="flex items-center justify-center">
        <h1 className="text-lg font-semibold text-gray-900">{getPageTitle(currentPage)}</h1>
      </div>
    </div>
  )
}

const Dashboard = ({
  medications,
  getExpiryStatus,
  getStockStatus,
  stockChartData,
  movementChartData,
  entries,
  exits,
  setIsAddMedicationOpen,
  setIsAddEntryOpen,
  setIsAddExitOpen,
}: {
  medications: Medication[]
  getExpiryStatus: (expiry: string) => { status: string; color: string }
  getStockStatus: (stock: number) => { status: string; color: string }
  stockChartData: any[]
  movementChartData: any[]
  entries: Entry[]
  exits: Exit[]
  setIsAddMedicationOpen: (open: boolean) => void
  setIsAddEntryOpen: (open: boolean) => void
  setIsAddExitOpen: (open: boolean) => void
}) => (
  <div className="space-y-6">
    <div className="hidden md:block">
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Painel de Controle</h1>
      <p className="text-sm md:text-base text-gray-600">Visão geral do seu inventário de medicamentos</p>
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Total de Medicamentos</CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold">{medications.length}</div>
          <p className="text-xs text-muted-foreground">Itens ativos no inventário</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Vencendo em Breve</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-orange-600">
            {medications.filter((med) => getExpiryStatus(med.expiry).status === "vencendo").length}
          </div>
          <p className="text-xs text-muted-foreground">Dentro de 30 dias</p>
        </CardContent>
      </Card>

      <Card className="sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Estoque Baixo</CardTitle>
          <TrendingDown className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl font-bold text-red-600">
            {medications.filter((med) => getStockStatus(med.stock).status === "crítico").length}
          </div>
          <p className="text-xs text-muted-foreground">≤ 10 unidades restantes</p>
        </CardContent>
      </Card>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
      <Button
        type="button"
        className="bg-blue-600 hover:bg-blue-700 text-sm md:text-base"
        onClick={() => setIsAddMedicationOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Medicamento
      </Button>

      <Button type="button" variant="outline" className="text-sm md:text-base" onClick={() => setIsAddEntryOpen(true)}>
        <ArrowUpCircle className="h-4 w-4 mr-2" />
        Registrar Entrada
      </Button>

      <Button type="button" variant="outline" className="text-sm md:text-base" onClick={() => setIsAddExitOpen(true)}>
        <ArrowDownCircle className="h-4 w-4 mr-2" />
        Registrar Saída
      </Button>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <BarChart3 className="h-4 md:h-5 w-4 md:w-5" />
            Níveis de Estoque
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">Quantidade atual de medicamentos em estoque</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stockChartData}>
              <XAxis dataKey="name" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip formatter={(value) => [`${value} unidades`, "Estoque"]} labelFormatter={(label) => `${label}`} />
              <Bar dataKey="stock" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base md:text-lg">
            <Activity className="h-4 md:h-5 w-4 md:w-5" />
            Movimentação Mensal
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">Entradas e saídas de medicamentos por mês</CardDescription>
        </CardHeader>
        <CardContent className="h-[250px] md:h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={movementChartData}>
              <XAxis dataKey="month" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip
                formatter={(value, name) => [`${value} unidades`, name === "entries" ? "Entradas" : "Saídas"]}
                labelFormatter={(label) => `Mês: ${label}`}
              />
              <Legend formatter={(value) => (value === "entries" ? "Entradas" : "Saídas")} />
              <Line
                type="monotone"
                dataKey="entries"
                stroke="#16a34a"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="exits"
                stroke="#dc2626"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="text-base md:text-lg">Atividade Recente</CardTitle>
        <CardDescription className="text-xs md:text-sm">Últimas movimentações de medicamentos</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {[...entries.slice(0, 2), ...exits.slice(0, 2)].map((item, index) => (
            <div key={index} className="flex items-center justify-between p-2 md:p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 md:gap-3">
                {"supplier" in item ? (
                  <ArrowUpCircle className="h-4 md:h-5 w-4 md:w-5 text-green-600 flex-shrink-0" />
                ) : (
                  <ArrowDownCircle className="h-4 md:h-5 w-4 md:w-5 text-red-600 flex-shrink-0" />
                )}
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm md:text-base truncate">{item.medication}</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">
                    {"supplier" in item ? `Entrada de ${item.supplier}` : `Saída - ${item.reason}`}
                  </p>
                </div>
              </div>
              <span className="text-xs md:text-sm text-gray-500 flex-shrink-0 ml-2">{item.date}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
)

const MedicationList = ({
  medications,
  setIsAddMedicationOpen,
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredMedications,
  getExpiryStatus,
  getStockStatus,
  openEditMedication,
  openDeleteDialog,
}: {
  medications: Medication[]
  setIsAddMedicationOpen: (open: boolean) => void
  searchTerm: string
  setSearchTerm: (term: string) => void
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: string[]
  filteredMedications: Medication[]
  getExpiryStatus: (expiry: string) => { status: string; color: string }
  getStockStatus: (stock: number) => { status: string; color: string }
  openEditMedication: (medication: Medication) => void
  openDeleteDialog: (type: string, id: number) => void
}) => (
  <div className="space-y-6">
    <div className="hidden md:flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Medicamentos</h1>
        <p className="text-gray-600">Gerencie seu inventário de medicamentos</p>
      </div>
      <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddMedicationOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Novo Medicamento
      </Button>
    </div>

    <div className="md:hidden">
      <Button
        type="button"
        className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
        onClick={() => setIsAddMedicationOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Adicionar Novo Medicamento
      </Button>
    </div>

    <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
      <div className="relative flex-1 max-w-full md:max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Buscar medicamentos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full md:w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filtrar por categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead className="hidden sm:table-cell">Lote</TableHead>
              <TableHead>Validade</TableHead>
              <TableHead className="hidden md:table-cell">Fabricante</TableHead>
              <TableHead className="hidden lg:table-cell">Categoria</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedications.map((medication) => (
              <TableRow key={medication.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{medication.name}</div>
                    <div className="text-xs text-gray-500 sm:hidden">Lote: {medication.lot}</div>
                    <div className="text-xs text-gray-500 md:hidden">{medication.manufacturer}</div>
                    <div className="text-xs text-gray-500 lg:hidden">
                      <Badge variant="outline" className="text-xs">
                        {medication.category}
                      </Badge>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{medication.lot}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm">{medication.expiry}</span>
                    <Badge variant={getExpiryStatus(medication.expiry).color as any} className="text-xs">
                      {getExpiryStatus(medication.expiry).status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">{medication.manufacturer}</TableCell>
                <TableCell className="hidden lg:table-cell">
                  <Badge variant="outline">{medication.category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium">{medication.stock}</span>
                    <Badge variant={getStockStatus(medication.stock).color as any} className="text-xs">
                      {getStockStatus(medication.stock).status}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => openEditMedication(medication)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog("medication", medication.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  </div>
)

const EntriesPage = ({
  entries,
  setIsAddEntryOpen,
  openEditEntry,
  openDeleteDialog,
}: {
  entries: Entry[]
  setIsAddEntryOpen: (open: boolean) => void
  openEditEntry: (entry: Entry) => void
  openDeleteDialog: (type: string, id: number) => void
}) => (
  <div className="space-y-6">
    <div className="hidden md:flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Entradas</h1>
        <p className="text-gray-600">Acompanhe as entradas de estoque de medicamentos</p>
      </div>
      <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddEntryOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Registrar Nova Entrada
      </Button>
    </div>

    <div className="md:hidden">
      <Button
        type="button"
        className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
        onClick={() => setIsAddEntryOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Registrar Nova Entrada
      </Button>
    </div>

    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead className="hidden sm:table-cell">Lote</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="hidden md:table-cell">Fornecedor</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{entry.medication}</div>
                    <div className="text-xs text-gray-500 sm:hidden">Lote: {entry.lot}</div>
                    <div className="text-xs text-gray-500 md:hidden">{entry.supplier}</div>
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell">{entry.lot}</TableCell>
                <TableCell>{entry.date}</TableCell>
                <TableCell className="hidden md:table-cell">{entry.supplier}</TableCell>
                <TableCell>{entry.quantity}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => openEditEntry(entry)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => openDeleteDialog("entry", entry.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  </div>
)

const ExitsPage = ({
  exits,
  setIsAddExitOpen,
  openEditExit,
  openDeleteDialog,
}: {
  exits: Exit[]
  setIsAddExitOpen: (open: boolean) => void
  openEditExit: (exit: Exit) => void
  openDeleteDialog: (type: string, id: number) => void
}) => (
  <div className="space-y-6">
    <div className="hidden md:flex justify-between items-center">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Saídas</h1>
        <p className="text-gray-600">Acompanhe as saídas de estoque de medicamentos</p>
      </div>
      <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={() => setIsAddExitOpen(true)}>
        <Plus className="h-4 w-4 mr-2" />
        Registrar Nova Saída
      </Button>
    </div>

    <div className="md:hidden">
      <Button
        type="button"
        className="w-full bg-blue-600 hover:bg-blue-700 mb-4"
        onClick={() => setIsAddExitOpen(true)}
      >
        <Plus className="h-4 w-4 mr-2" />
        Registrar Nova Saída
      </Button>
    </div>

    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="hidden sm:table-cell">Motivo</TableHead>
              <TableHead className="hidden md:table-cell">Responsável</TableHead>
              <TableHead>Quantidade</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exits.map((exit) => (
              <TableRow key={exit.id}>
                <TableCell className="font-medium">
                  <div>
                    <div className="font-medium">{exit.medication}</div>
                    <div className="text-xs text-gray-500 sm:hidden">{exit.reason}</div>
                    <div className="text-xs text-gray-500 md:hidden">{exit.responsible}</div>
                  </div>
                </TableCell>
                <TableCell>{exit.date}</TableCell>
                <TableCell className="hidden sm:table-cell">{exit.reason}</TableCell>
                <TableCell className="hidden md:table-cell">{exit.responsible}</TableCell>
                <TableCell>{exit.quantity}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button type="button" variant="ghost" size="sm" onClick={() => openEditExit(exit)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="sm" onClick={() => openDeleteDialog("exit", exit.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  </div>
)

const AlertsPage = ({
  medications,
  getExpiryStatus,
  getStockStatus,
}: {
  medications: Medication[]
  getExpiryStatus: (expiry: string) => { status: string; color: string }
  getStockStatus: (stock: number) => { status: string; color: string }
}) => (
  <div className="space-y-6">
    <div className="hidden md:block">
      <h1 className="text-3xl font-bold text-gray-900">Alertas</h1>
      <p className="text-gray-600">Monitore medicamentos vencendo e níveis baixos de estoque</p>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-orange-600" />
            Vencendo em Breve
          </CardTitle>
          <CardDescription>Medicamentos vencendo em 30 dias</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medications
              .filter((med) => getExpiryStatus(med.expiry).status === "vencendo")
              .map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-gray-600">Vence em: {med.expiry}</p>
                  </div>
                  <Badge variant="destructive">Crítico</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-red-600" />
            Estoque Baixo
          </CardTitle>
          <CardDescription>Medicamentos com níveis baixos de inventário</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {medications
              .filter((med) => getStockStatus(med.stock).status === "crítico")
              .map((med) => (
                <div
                  key={med.id}
                  className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{med.name}</p>
                    <p className="text-sm text-gray-600">Estoque: {med.stock} unidades</p>
                  </div>
                  <Badge variant="destructive">Crítico</Badge>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>

    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Configurações de Notificação
        </CardTitle>
        <CardDescription>Configure como você recebe alertas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="email-alerts">Alertas por Email</Label>
            <p className="text-sm text-gray-600">Receber alertas via email</p>
          </div>
          <Switch id="email-alerts" />
        </div>
        <Separator />
        <div className="flex items-center justify-between">
          <div>
            <Label htmlFor="whatsapp-alerts">Alertas por WhatsApp</Label>
            <p className="text-sm text-gray-600">Receber alertas via WhatsApp</p>
          </div>
          <Switch id="whatsapp-alerts" />
        </div>
      </CardContent>
    </Card>
  </div>
)

const StockMonitoring = ({
  medications,
  selectedCategory,
  setSelectedCategory,
  categories,
  filteredMedications,
  getStockStatus,
  getExpiryStatus,
}: {
  medications: Medication[]
  selectedCategory: string
  setSelectedCategory: (category: string) => void
  categories: string[]
  filteredMedications: Medication[]
  getStockStatus: (stock: number) => { status: string; color: string }
  getExpiryStatus: (expiry: string) => { status: string; color: string }
}) => (
  <div className="space-y-6">
    <div className="hidden md:block">
      <h1 className="text-3xl font-bold text-gray-900">Monitoramento de Estoque</h1>
      <p className="text-gray-600">Monitoramento de inventário em tempo real</p>
    </div>

    <div className="flex gap-4 items-center">
      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
        <SelectTrigger className="w-full md:w-48">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Filtrar por categoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todas as Categorias</SelectItem>
          {categories.map((category) => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>

    <Card>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Medicamento</TableHead>
              <TableHead>Estoque</TableHead>
              <TableHead className="hidden sm:table-cell">Validade</TableHead>
              <TableHead className="hidden md:table-cell">Categoria</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMedications.map((medication) => {
              const stockStatus = getStockStatus(medication.stock)
              const expiryStatus = getExpiryStatus(medication.expiry)
              const isExpired = new Date(medication.expiry) < new Date()

              return (
                <TableRow
                  key={medication.id}
                  className={`${
                    stockStatus.status === "crítico" || isExpired
                      ? "bg-red-50 border-red-200"
                      : stockStatus.status === "baixo" || expiryStatus.status === "vencendo"
                        ? "bg-yellow-50 border-yellow-200"
                        : ""
                  }`}
                >
                  <TableCell className="font-medium">
                    <div>
                      <div className="font-medium">{medication.name}</div>
                      <div className="text-xs text-gray-500 sm:hidden">{medication.expiry}</div>
                      <div className="text-xs text-gray-500 md:hidden">
                        <Badge variant="outline" className="text-xs">
                          {medication.category}
                        </Badge>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className={stockStatus.status === "crítico" ? "text-red-600 font-semibold" : ""}>
                        {medication.stock} unidades
                      </span>
                      {stockStatus.status === "crítico" && <TrendingDown className="h-4 w-4 text-red-600" />}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span className={isExpired ? "text-red-600 font-semibold" : ""}>{medication.expiry}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Badge variant="outline">{medication.category}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Badge variant={stockStatus.color as any} className="text-xs">
                        {stockStatus.status}
                      </Badge>
                      {(expiryStatus.status === "vencendo" || isExpired) && (
                        <Badge variant="destructive" className="text-xs">
                          {isExpired ? "Vencido" : "Vencendo"}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  </div>
)

const SettingsPage = ({
  settings,
  setSettings,
  saveSettings,
}: {
  settings: AppSettings
  setSettings: (settings: AppSettings) => void
  saveSettings: () => void
}) => (
  <div className="space-y-6">
    <div className="hidden md:block">
      <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
      <p className="text-gray-600">Configure as preferências do sistema</p>
    </div>

    <Tabs defaultValue="thresholds" className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="thresholds" className="text-xs md:text-sm">
          Limites
        </TabsTrigger>
        <TabsTrigger value="alerts" className="text-xs md:text-sm">
          Alertas
        </TabsTrigger>
        <TabsTrigger value="notifications" className="text-xs md:text-sm">
          Notificações
        </TabsTrigger>
      </TabsList>

      <TabsContent value="thresholds" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Limites de Nível de Estoque</CardTitle>
            <CardDescription>Configure os níveis mínimos de estoque para alertas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="critical-threshold">Nível Crítico de Estoque</Label>
              <Input
                id="critical-threshold"
                type="number"
                value={settings.criticalThreshold}
                onChange={(e) => setSettings({ ...settings, criticalThreshold: Number.parseInt(e.target.value) || 0 })}
              />
              <p className="text-sm text-gray-600">Alertar quando o estoque ficar abaixo deste nível</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="low-threshold">Nível Baixo de Estoque</Label>
              <Input
                id="low-threshold"
                type="number"
                value={settings.lowThreshold}
                onChange={(e) => setSettings({ ...settings, lowThreshold: Number.parseInt(e.target.value) || 0 })}
              />
              <p className="text-sm text-gray-600">Aviso quando o estoque ficar abaixo deste nível</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="alerts" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Alertas de Validade</CardTitle>
            <CardDescription>Configure quando receber alertas de validade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="expiry-warning">Período de Aviso (dias)</Label>
              <Input
                id="expiry-warning"
                type="number"
                value={settings.expiryWarning}
                onChange={(e) => setSettings({ ...settings, expiryWarning: Number.parseInt(e.target.value) || 0 })}
              />
              <p className="text-sm text-gray-600">Mostrar aviso quando o medicamento vencer dentro deste período</p>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="expiry-critical">Período Crítico (dias)</Label>
              <Input
                id="expiry-critical"
                type="number"
                value={settings.expiryCritical}
                onChange={(e) => setSettings({ ...settings, expiryCritical: Number.parseInt(e.target.value) || 0 })}
              />
              <p className="text-sm text-gray-600">
                Mostrar alerta crítico quando o medicamento vencer dentro deste período
              </p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Preferências de Notificação</CardTitle>
            <CardDescription>Escolha como você quer receber notificações</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="email-notifications">Notificações por Email</Label>
                  <p className="text-sm text-gray-600">Receber notificações via email</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="whatsapp-notifications">Notificações por WhatsApp</Label>
                  <p className="text-sm text-gray-600">Receber notificações via WhatsApp</p>
                </div>
                <Switch
                  id="whatsapp-notifications"
                  checked={settings.whatsappNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, whatsappNotifications: checked })}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="daily-summary">Resumo Diário</Label>
                  <p className="text-sm text-gray-600">Receber resumo diário do inventário</p>
                </div>
                <Switch
                  id="daily-summary"
                  checked={settings.dailySummary}
                  onCheckedChange={(checked) => setSettings({ ...settings, dailySummary: checked })}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="email-address">Endereço de Email</Label>
              <Input
                id="email-address"
                type="email"
                placeholder="admin@farmacia.com"
                value={settings.emailAddress}
                onChange={(e) => setSettings({ ...settings, emailAddress: e.target.value })}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="whatsapp-number">Número do WhatsApp</Label>
              <Input
                id="whatsapp-number"
                type="tel"
                placeholder="+5511999999999"
                value={settings.whatsappNumber}
                onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>

    <div className="flex justify-end">
      <Button type="button" className="bg-blue-600 hover:bg-blue-700" onClick={saveSettings}>
        Salvar Configurações
      </Button>
    </div>
  </div>
)

export default function Home() {
  const [currentPage, setCurrentPage] = useState("dashboard")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [mounted, setMounted] = useState(false)

  // Notification state
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Modal states
  const [isAddMedicationOpen, setIsAddMedicationOpen] = useState(false)
  const [isEditMedicationOpen, setIsEditMedicationOpen] = useState(false)
  const [isAddEntryOpen, setIsAddEntryOpen] = useState(false)
  const [isEditEntryOpen, setIsEditEntryOpen] = useState(false)
  const [isAddExitOpen, setIsAddExitOpen] = useState(false)
  const [isEditExitOpen, setIsEditExitOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{ type: string; id: number } | null>(null)

  // Form states
  const [editingMedication, setEditingMedication] = useState<Medication | null>(null)
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null)
  const [editingExit, setEditingExit] = useState<Exit | null>(null)

  // Data states - Initialize with sample data
  const [medications, setMedications] = useState<Medication[]>(sampleMedications)
  const [entries, setEntries] = useState<Entry[]>(sampleEntries)
  const [exits, setExits] = useState<Exit[]>(sampleExits)

  // Settings state
  const [settings, setSettings] = useState<AppSettings>({
    criticalThreshold: 10,
    lowThreshold: 30,
    expiryWarning: 90,
    expiryCritical: 30,
    emailNotifications: true,
    whatsappNotifications: false,
    dailySummary: true,
    emailAddress: "",
    whatsappNumber: "",
  })

  // Load settings from localStorage
  useEffect(() => {
    if (mounted) {
      const savedSettings = localStorage.getItem("settings")
      if (savedSettings) {
        try {
          const parsedSettings = JSON.parse(savedSettings)
          setSettings(parsedSettings)
        } catch (error) {
          console.error("Error parsing saved settings:", error)
        }
      }
    }
  }, [mounted])

  // Save settings to localStorage
  const saveSettings = () => {
    if (mounted) {
      localStorage.setItem("settings", JSON.stringify(settings))
      showNotification("success", "Sucesso", "Configurações salvas com sucesso.")
    }
  }

  // Notification functions
  const showNotification = (type: "success" | "error" | "warning" | "info", title: string, message: string) => {
    const id = Date.now()
    const newNotification: Notification = { id, type, title, message }
    setNotifications((prev) => [...prev, newNotification])

    // Auto remove after 5 seconds
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 5000)
  }

  const removeNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  // Handle mounting and localStorage loading
  useEffect(() => {
    setMounted(true)

    // Load data from localStorage after component mounts
    const savedMedications = localStorage.getItem("medications")
    const savedEntries = localStorage.getItem("entries")
    const savedExits = localStorage.getItem("exits")

    if (savedMedications) {
      try {
        const parsedMedications = JSON.parse(savedMedications)
        if (Array.isArray(parsedMedications) && parsedMedications.length > 0) {
          setMedications(parsedMedications)
        }
      } catch (error) {
        console.error("Error parsing saved medications:", error)
      }
    }

    if (savedEntries) {
      try {
        const parsedEntries = JSON.parse(savedEntries)
        if (Array.isArray(parsedEntries) && parsedEntries.length > 0) {
          setEntries(parsedEntries)
        }
      } catch (error) {
        console.error("Error parsing saved entries:", error)
      }
    }

    if (savedExits) {
      try {
        const parsedExits = JSON.parse(savedExits)
        if (Array.isArray(parsedExits) && parsedExits.length > 0) {
          setExits(parsedExits)
        }
      } catch (error) {
        console.error("Error parsing saved exits:", error)
      }
    }
  }, [])

  // Save medications to localStorage whenever medications state changes (only after mounting)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("medications", JSON.stringify(medications))
    }
  }, [medications, mounted])

  // Save entries to localStorage whenever entries state changes (only after mounting)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("entries", JSON.stringify(entries))
    }
  }, [entries, mounted])

  // Save exits to localStorage whenever exits state changes (only after mounting)
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("exits", JSON.stringify(exits))
    }
  }, [exits, mounted])

  // Form data states
  const [medicationForm, setMedicationForm] = useState({
    name: "",
    lot: "",
    expiry: "",
    manufacturer: "",
    category: "",
    stock: "",
  })

  const [entryForm, setEntryForm] = useState({
    medication: "",
    lot: "",
    date: "",
    supplier: "",
    quantity: "",
  })

  const [exitForm, setExitForm] = useState({
    medication: "",
    quantity: "",
    reason: "",
    responsible: "",
    notes: "",
  })

  const handleCancelMedication = () => {
    setMedicationForm({ name: "", lot: "", expiry: "", manufacturer: "", category: "", stock: "" })
    setEditingMedication(null)
    setIsAddMedicationOpen(false)
    setIsEditMedicationOpen(false)
  }

  const handleCancelEntry = () => {
    setEntryForm({ medication: "", lot: "", date: "", supplier: "", quantity: "" })
    setEditingEntry(null)
    setIsAddEntryOpen(false)
    setIsEditEntryOpen(false)
  }

  const handleCancelExit = () => {
    setExitForm({ medication: "", quantity: "", reason: "", responsible: "", notes: "" })
    setEditingExit(null)
    setIsAddExitOpen(false)
    setIsEditExitOpen(false)
  }

  // Helper functions
  const filteredMedications = medications.filter((med) => {
    const matchesSearch = med.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || med.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const categories = [...new Set(medications.map((med) => med.category))]

  const getStockStatus = (stock: number) => {
    if (stock <= settings.criticalThreshold) return { status: "crítico", color: "destructive" }
    if (stock <= settings.lowThreshold) return { status: "baixo", color: "warning" }
    return { status: "bom", color: "default" }
  }

  const getExpiryStatus = (expiry: string) => {
    const expiryDate = new Date(expiry)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24))

    if (daysUntilExpiry <= settings.expiryCritical) return { status: "vencendo", color: "destructive" }
    if (daysUntilExpiry <= settings.expiryWarning) return { status: "atenção", color: "warning" }
    return { status: "bom", color: "default" }
  }

  // Fix the stock chart data to display properly
  const stockChartData = medications
    .slice(0, 5) // Limit to 5 items to prevent overcrowding
    .map((med) => ({
      name: med.name.split(" ")[0], // First word only for cleaner display
      stock: med.stock,
    }))

  // Fix the movement chart data to use proper month names
  const movementChartData = [
    { month: "Jan", entries: 45, exits: 32 },
    { month: "Fev", entries: 52, exits: 28 },
    { month: "Mar", entries: 38, exits: 41 },
    { month: "Abr", entries: 61, exits: 35 },
    { month: "Mai", entries: 48, exits: 39 },
    { month: "Jun", entries: 55, exits: 42 },
  ]

  // CRUD handlers
  const handleAddMedication = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (
      !medicationForm.name ||
      !medicationForm.lot ||
      !medicationForm.expiry ||
      !medicationForm.manufacturer ||
      !medicationForm.category ||
      !medicationForm.stock
    ) {
      showNotification("error", "Erro de Validação", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const newMedication: Medication = {
      id: medications.length > 0 ? Math.max(...medications.map((m) => m.id)) + 1 : 1,
      name: medicationForm.name,
      lot: medicationForm.lot,
      expiry: medicationForm.expiry,
      manufacturer: medicationForm.manufacturer,
      category: medicationForm.category,
      stock: Number.parseInt(medicationForm.stock),
    }

    setMedications([...medications, newMedication])
    setMedicationForm({ name: "", lot: "", expiry: "", manufacturer: "", category: "", stock: "" })
    setIsAddMedicationOpen(false)

    showNotification("success", "Sucesso", "Medicamento adicionado com sucesso.")
  }

  const handleEditMedication = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (
      !editingMedication ||
      !medicationForm.name ||
      !medicationForm.lot ||
      !medicationForm.expiry ||
      !medicationForm.manufacturer ||
      !medicationForm.category ||
      !medicationForm.stock
    ) {
      showNotification("error", "Erro de Validação", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const updatedMedication: Medication = {
      ...editingMedication,
      name: medicationForm.name,
      lot: medicationForm.lot,
      expiry: medicationForm.expiry,
      manufacturer: medicationForm.manufacturer,
      category: medicationForm.category,
      stock: Number.parseInt(medicationForm.stock),
    }

    setMedications(medications.map((med) => (med.id === editingMedication.id ? updatedMedication : med)))
    setMedicationForm({ name: "", lot: "", expiry: "", manufacturer: "", category: "", stock: "" })
    setEditingMedication(null)
    setIsEditMedicationOpen(false)

    showNotification("success", "Sucesso", "Medicamento atualizado com sucesso.")
  }

  const handleDeleteMedication = (id: number) => {
    setMedications(medications.filter((med) => med.id !== id))
    showNotification("success", "Sucesso", "Medicamento excluído com sucesso.")
  }

  const handleAddEntry = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!entryForm.medication || !entryForm.lot || !entryForm.date || !entryForm.supplier || !entryForm.quantity) {
      showNotification("error", "Erro de Validação", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const newEntry: Entry = {
      id: entries.length > 0 ? Math.max(...entries.map((e) => e.id)) + 1 : 1,
      medication: entryForm.medication,
      lot: entryForm.lot,
      date: entryForm.date,
      supplier: entryForm.supplier,
      quantity: Number.parseInt(entryForm.quantity),
    }

    setEntries([...entries, newEntry])

    // Update medication stock
    const medication = medications.find((med) => med.name === entryForm.medication)
    if (medication) {
      setMedications(
        medications.map((med) =>
          med.name === entryForm.medication ? { ...med, stock: med.stock + Number.parseInt(entryForm.quantity) } : med,
        ),
      )
    }

    setEntryForm({ medication: "", lot: "", date: "", supplier: "", quantity: "" })
    setIsAddEntryOpen(false)

    showNotification("success", "Sucesso", "Entrada registrada com sucesso.")
  }

  const handleEditEntry = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (
      !editingEntry ||
      !entryForm.medication ||
      !entryForm.lot ||
      !entryForm.date ||
      !entryForm.supplier ||
      !entryForm.quantity
    ) {
      showNotification("error", "Erro de Validação", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const updatedEntry: Entry = {
      ...editingEntry,
      medication: entryForm.medication,
      lot: entryForm.lot,
      date: entryForm.date,
      supplier: entryForm.supplier,
      quantity: Number.parseInt(entryForm.quantity),
    }

    setEntries(entries.map((entry) => (entry.id === editingEntry.id ? updatedEntry : entry)))
    setEntryForm({ medication: "", lot: "", date: "", supplier: "", quantity: "" })
    setEditingEntry(null)
    setIsEditEntryOpen(false)

    showNotification("success", "Sucesso", "Entrada atualizada com sucesso.")
  }

  const handleDeleteEntry = (id: number) => {
    setEntries(entries.filter((entry) => entry.id !== id))
    showNotification("success", "Sucesso", "Entrada excluída com sucesso.")
  }

  const handleAddExit = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!exitForm.medication || !exitForm.quantity || !exitForm.reason || !exitForm.responsible) {
      showNotification("error", "Erro de Validação", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const newExit: Exit = {
      id: exits.length > 0 ? Math.max(...exits.map((e) => e.id)) + 1 : 1,
      medication: exitForm.medication,
      date: new Date().toISOString().split("T")[0],
      reason: exitForm.reason,
      responsible: exitForm.responsible,
      quantity: Number.parseInt(exitForm.quantity),
    }

    setExits([...exits, newExit])

    // Update medication stock
    const medication = medications.find((med) => med.name === exitForm.medication)
    if (medication) {
      setMedications(
        medications.map((med) =>
          med.name === exitForm.medication
            ? { ...med, stock: Math.max(0, med.stock - Number.parseInt(exitForm.quantity)) }
            : med,
        ),
      )
    }

    setExitForm({ medication: "", quantity: "", reason: "", responsible: "", notes: "" })
    setIsAddExitOpen(false)

    showNotification("success", "Sucesso", "Saída registrada com sucesso.")
  }

  const handleEditExit = (e?: React.FormEvent) => {
    e?.preventDefault()

    if (!editingExit || !exitForm.medication || !exitForm.quantity || !exitForm.reason || !exitForm.responsible) {
      showNotification("error", "Erro de Validação", "Por favor, preencha todos os campos obrigatórios.")
      return
    }

    const updatedExit: Exit = {
      ...editingExit,
      medication: exitForm.medication,
      reason: exitForm.reason,
      responsible: exitForm.responsible,
      quantity: Number.parseInt(exitForm.quantity),
    }

    setExits(exits.map((exit) => (exit.id === editingExit.id ? updatedExit : exit)))
    setExitForm({ medication: "", quantity: "", reason: "", responsible: "", notes: "" })
    setEditingExit(null)
    setIsEditExitOpen(false)

    showNotification("success", "Sucesso", "Saída atualizada com sucesso.")
  }

  const handleDeleteExit = (id: number) => {
    setExits(exits.filter((exit) => exit.id !== id))
    showNotification("success", "Sucesso", "Saída excluída com sucesso.")
  }

  const openEditMedication = (medication: Medication) => {
    setEditingMedication(medication)
    setMedicationForm({
      name: medication.name,
      lot: medication.lot,
      expiry: medication.expiry,
      manufacturer: medication.manufacturer,
      category: medication.category,
      stock: medication.stock.toString(),
    })
    setIsEditMedicationOpen(true)
  }

  const openEditEntry = (entry: Entry) => {
    setEditingEntry(entry)
    setEntryForm({
      medication: entry.medication,
      lot: entry.lot,
      date: entry.date,
      supplier: entry.supplier,
      quantity: entry.quantity.toString(),
    })
    setIsEditEntryOpen(true)
  }

  const openEditExit = (exit: Exit) => {
    setEditingExit(exit)
    setExitForm({
      medication: exit.medication,
      quantity: exit.quantity.toString(),
      reason: exit.reason,
      responsible: exit.responsible,
      notes: "",
    })
    setIsEditExitOpen(true)
  }

  const openDeleteDialog = (type: string, id: number) => {
    setItemToDelete({ type, id })
    setDeleteDialogOpen(true)
  }

  const handleDelete = () => {
    if (!itemToDelete) return

    switch (itemToDelete.type) {
      case "medication":
        handleDeleteMedication(itemToDelete.id)
        break
      case "entry":
        handleDeleteEntry(itemToDelete.id)
        break
      case "exit":
        handleDeleteExit(itemToDelete.id)
        break
    }

    setDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  // Notification Component
  const NotificationContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`flex items-start gap-3 p-4 rounded-lg shadow-lg border max-w-sm ${
            notification.type === "success"
              ? "bg-green-50 border-green-200 text-green-800"
              : notification.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : notification.type === "warning"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <div className="flex-shrink-0">
            {notification.type === "success" && <CheckCircle className="h-5 w-5 text-green-600" />}
            {notification.type === "error" && <XCircle className="h-5 w-5 text-red-600" />}
            {notification.type === "warning" && <AlertCircle className="h-5 w-5 text-yellow-600" />}
            {notification.type === "info" && <AlertCircle className="h-5 w-5 text-blue-600" />}
          </div>
          <div className="flex-1">
            <h4 className="font-medium">{notification.title}</h4>
            <p className="text-sm opacity-90">{notification.message}</p>
          </div>
          <button
            type="button"
            onClick={() => removeNotification(notification.id)}
            className="flex-shrink-0 opacity-70 hover:opacity-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            medications={medications}
            getExpiryStatus={getExpiryStatus}
            getStockStatus={getStockStatus}
            stockChartData={stockChartData}
            movementChartData={movementChartData}
            entries={entries}
            exits={exits}
            setIsAddMedicationOpen={setIsAddMedicationOpen}
            setIsAddEntryOpen={setIsAddEntryOpen}
            setIsAddExitOpen={setIsAddExitOpen}
          />
        )
      case "medications":
        return (
          <MedicationList
            medications={medications}
            setIsAddMedicationOpen={setIsAddMedicationOpen}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            filteredMedications={filteredMedications}
            getExpiryStatus={getExpiryStatus}
            getStockStatus={getStockStatus}
            openEditMedication={openEditMedication}
            openDeleteDialog={openDeleteDialog}
          />
        )
      case "entries":
        return (
          <EntriesPage
            entries={entries}
            setIsAddEntryOpen={setIsAddEntryOpen}
            openEditEntry={openEditEntry}
            openDeleteDialog={openDeleteDialog}
          />
        )
      case "exits":
        return (
          <ExitsPage
            exits={exits}
            setIsAddExitOpen={setIsAddExitOpen}
            openEditExit={openEditExit}
            openDeleteDialog={openDeleteDialog}
          />
        )
      case "alerts":
        return (
          <AlertsPage medications={medications} getExpiryStatus={getExpiryStatus} getStockStatus={getStockStatus} />
        )
      case "monitoring":
        return (
          <StockMonitoring
            medications={medications}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            filteredMedications={filteredMedications}
            getStockStatus={getStockStatus}
            getExpiryStatus={getExpiryStatus}
          />
        )
      case "settings":
        return <SettingsPage settings={settings} setSettings={setSettings} saveSettings={saveSettings} />
      default:
        return (
          <Dashboard
            medications={medications}
            getExpiryStatus={getExpiryStatus}
            getStockStatus={getStockStatus}
            stockChartData={stockChartData}
            movementChartData={movementChartData}
            entries={entries}
            exits={exits}
            setIsAddMedicationOpen={setIsAddMedicationOpen}
            setIsAddEntryOpen={setIsAddEntryOpen}
            setIsAddExitOpen={setIsAddExitOpen}
          />
        )
    }
  }

  // Don't render anything until component is mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <>
      {/* Mobile Navigation */}
      <MobileNav currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Desktop Sidebar */}
      <Sidebar currentPage={currentPage} setCurrentPage={setCurrentPage} />

      {/* Mobile Header */}
      <MobileHeader currentPage={currentPage} />

      {/* Main Content */}
      <div className={`md:ml-64 p-6 ${inter.className}`}>{renderCurrentPage()}</div>

      {/* Notification Container */}
      <NotificationContainer />

      {/* Add Medication Dialog */}
      <Dialog open={isAddMedicationOpen} onOpenChange={setIsAddMedicationOpen}>
        <MedicationForm
          medicationForm={medicationForm}
          setMedicationForm={setMedicationForm}
          onSubmit={handleAddMedication}
          onCancel={handleCancelMedication}
        />
      </Dialog>

      {/* Edit Medication Dialog */}
      <Dialog open={isEditMedicationOpen} onOpenChange={setIsEditMedicationOpen}>
        <MedicationForm
          isEdit
          medicationForm={medicationForm}
          setMedicationForm={setMedicationForm}
          onSubmit={handleEditMedication}
          onCancel={handleCancelMedication}
        />
      </Dialog>

      {/* Add Entry Dialog */}
      <Dialog open={isAddEntryOpen} onOpenChange={setIsAddEntryOpen}>
        <EntryForm
          medications={medications}
          entryForm={entryForm}
          setEntryForm={setEntryForm}
          onSubmit={handleAddEntry}
          onCancel={handleCancelEntry}
        />
      </Dialog>

      {/* Edit Entry Dialog */}
      <Dialog open={isEditEntryOpen} onOpenChange={setIsEditEntryOpen}>
        <EntryForm
          isEdit
          medications={medications}
          entryForm={entryForm}
          setEntryForm={setEntryForm}
          onSubmit={handleEditEntry}
          onCancel={handleCancelEntry}
        />
      </Dialog>

      {/* Add Exit Dialog */}
      <Dialog open={isAddExitOpen} onOpenChange={setIsAddExitOpen}>
        <ExitForm
          medications={medications}
          exitForm={exitForm}
          setExitForm={setExitForm}
          onSubmit={handleAddExit}
          onCancel={handleCancelExit}
        />
      </Dialog>

      {/* Edit Exit Dialog */}
      <Dialog open={isEditExitOpen} onOpenChange={setIsEditExitOpen}>
        <ExitForm
          isEdit
          medications={medications}
          exitForm={exitForm}
          setExitForm={setExitForm}
          onSubmit={handleEditExit}
          onCancel={handleCancelExit}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. Isso excluirá permanentemente o(a) {itemToDelete?.type}.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Excluir</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
