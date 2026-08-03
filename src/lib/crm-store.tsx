import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import {
  customers as seedCustomers,
  leads as seedLeads,
  opportunities as seedOpportunities,
  tasks as seedTasks,
  type Customer,
  type Lead,
  type Opportunity,
  type PipelineStage,
  type Task,
} from "./mock-data";

interface CrmContextValue {
  customers: Customer[];
  leads: Lead[];
  opportunities: Opportunity[];
  tasks: Task[];
  addCustomer: (c: Omit<Customer, "id">) => Customer;
  updateCustomer: (id: string, patch: Partial<Customer>) => void;
  deleteCustomer: (id: string) => void;
  updateLead: (id: string, patch: Partial<Lead>) => void;
  addLead: (l: Omit<Lead, "id">) => void;
  moveOpportunity: (id: string, stage: PipelineStage) => void;
  addTask: (t: Omit<Task, "id">) => void;
  updateTask: (id: string, patch: Partial<Task>) => void;
  deleteTask: (id: string) => void;
}

const CrmContext = createContext<CrmContextValue | null>(null);

const uid = (prefix: string) => `${prefix}${Math.random().toString(36).slice(2, 9)}`;

export function CrmProvider({ children }: { children: ReactNode }) {
  const [customers, setCustomers] = useState<Customer[]>(seedCustomers);
  const [leads, setLeads] = useState<Lead[]>(seedLeads);
  const [opportunities, setOpportunities] = useState<Opportunity[]>(seedOpportunities);
  const [tasks, setTasks] = useState<Task[]>(seedTasks);

  const addCustomer = useCallback((c: Omit<Customer, "id">) => {
    const created = { ...c, id: uid("c") };
    setCustomers((prev) => [created, ...prev]);
    return created;
  }, []);

  const updateCustomer = useCallback((id: string, patch: Partial<Customer>) => {
    setCustomers((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const deleteCustomer = useCallback((id: string) => {
    setCustomers((prev) => prev.filter((c) => c.id !== id));
  }, []);

  const updateLead = useCallback((id: string, patch: Partial<Lead>) => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }, []);

  const addLead = useCallback((l: Omit<Lead, "id">) => {
    setLeads((prev) => [{ ...l, id: uid("l") }, ...prev]);
  }, []);

  const moveOpportunity = useCallback((id: string, stage: PipelineStage) => {
    setOpportunities((prev) => prev.map((o) => (o.id === id ? { ...o, stage } : o)));
  }, []);

  const addTask = useCallback((t: Omit<Task, "id">) => {
    setTasks((prev) => [{ ...t, id: uid("t") }, ...prev]);
  }, []);

  const updateTask = useCallback((id: string, patch: Partial<Task>) => {
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTask = useCallback((id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const value = useMemo(
    () => ({
      customers,
      leads,
      opportunities,
      tasks,
      addCustomer,
      updateCustomer,
      deleteCustomer,
      updateLead,
      addLead,
      moveOpportunity,
      addTask,
      updateTask,
      deleteTask,
    }),
    [customers, leads, opportunities, tasks, addCustomer, updateCustomer, deleteCustomer, updateLead, addLead, moveOpportunity, addTask, updateTask, deleteTask],
  );

  return <CrmContext.Provider value={value}>{children}</CrmContext.Provider>;
}

export function useCrm() {
  const ctx = useContext(CrmContext);
  if (!ctx) throw new Error("useCrm must be used inside CrmProvider");
  return ctx;
}
