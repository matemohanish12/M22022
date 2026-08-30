-- Migration: initial schema for BCM Platform (generated from schema.sql)
-- Run with: psql "postgresql://<user>:<pass>@<host>:<port>/<db>" -f migrations/20260829-initial.sql

-- Enable uuid generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Common enums
CREATE TYPE incident_status AS ENUM ('open','investigation','response','recovery','closed');
CREATE TYPE test_status AS ENUM ('planned','in_progress','completed','failed','retest_required');
CREATE TYPE plan_status AS ENUM ('draft','approved','active','retired');
CREATE TYPE severity_level AS ENUM ('low','medium','high','critical');
CREATE TYPE risk_likelihood AS ENUM ('rare','unlikely','possible','likely','almost_certain');
CREATE TYPE risk_impact_level AS ENUM ('low','medium','high','critical');
CREATE TYPE document_type AS ENUM ('bcm_plan','dr_plan','policy','procedure','audit_report','test_report','contact_list','other');
CREATE TYPE user_role AS ENUM ('bcm_admin','service_owner','risk_manager','recovery_member','department_head','auditor','executive');

-- Users and RBAC
CREATE TABLE app_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id TEXT,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  enabled BOOLEAN DEFAULT TRUE,
  preferred_theme TEXT DEFAULT 'light',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by UUID,
  updated_by UUID
);

CREATE TABLE roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name user_role UNIQUE,
  display_name TEXT NOT NULL,
  description TEXT
);

CREATE TABLE user_roles (
  user_id UUID REFERENCES app_users(id) ON DELETE CASCADE,
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  department_id UUID,
  PRIMARY KEY (user_id, role_id, department_id)
);

-- Departments and business units
CREATE TABLE business_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES business_units(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  business_unit_id UUID REFERENCES business_units(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  code TEXT,
  description TEXT,
  manager_id UUID REFERENCES app_users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Contacts
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  role TEXT,
  department_id UUID REFERENCES departments(id),
  phone TEXT,
  email TEXT,
  alternate_contact TEXT,
  notes TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Vendors
CREATE TABLE vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  primary_contact_id UUID REFERENCES contacts(id),
  sla_details JSONB,
  criticality INTEGER DEFAULT 3,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Services and Subservices
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  business_function TEXT,
  owner_id UUID REFERENCES app_users(id),
  department_id UUID REFERENCES departments(id),
  criticality INTEGER DEFAULT 3,
  customer_impact TEXT,
  revenue_impact TEXT,
  regulatory_impact TEXT,
  operational_impact TEXT,
  status TEXT DEFAULT 'active',
  supporting_applications JSONB,
  supporting_infrastructure JSONB,
  key_dependencies JSONB,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE subservices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES app_users(id),
  recovery_priority INTEGER DEFAULT 5,
  rto INTERVAL,
  rpo INTERVAL,
  metadata JSONB,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE service_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  dependent_service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  dependency_type TEXT,
  notes TEXT
);

-- Business Impact Analysis (BIA)
CREATE TABLE bia_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE CASCADE,
  subservice_id UUID REFERENCES subservices(id) ON DELETE CASCADE,
  period_hours INTEGER NOT NULL,
  revenue_loss NUMERIC(18,2) DEFAULT 0,
  penalties NUMERIC(18,2) DEFAULT 0,
  recovery_cost NUMERIC(18,2) DEFAULT 0,
  process_disruption TEXT,
  productivity_loss NUMERIC(18,2) DEFAULT 0,
  compliance_exposure TEXT,
  legal_implications TEXT,
  customer_impact TEXT,
  market_impact TEXT,
  mtpd INTERVAL,
  rto INTERVAL,
  rpo INTERVAL,
  mao NUMERIC,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Risk Management
CREATE TABLE risk_register (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id TEXT UNIQUE,
  title TEXT NOT NULL,
  category TEXT,
  description TEXT,
  threat_source TEXT,
  vulnerability TEXT,
  likelihood risk_likelihood,
  impact risk_impact_level,
  inherent_rating INTEGER,
  existing_controls TEXT,
  residual_rating INTEGER,
  treatment_plan TEXT,
  owner_id UUID REFERENCES app_users(id),
  due_date date,
  status TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE risk_treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  risk_id UUID REFERENCES risk_register(id) ON DELETE CASCADE,
  treatment_description TEXT,
  owner_id UUID REFERENCES app_users(id),
  due_date date,
  status TEXT,
  created_at timestamptz DEFAULT now()
);

-- Continuity Strategies
CREATE TABLE continuity_strategies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  strategy_type TEXT,
  description TEXT,
  cost NUMERIC(18,2),
  feasibility_score INTEGER,
  recovery_coverage TEXT,
  owner_id UUID REFERENCES app_users(id),
  approval_status TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Recovery Plans and Activities
CREATE TABLE recovery_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_name TEXT NOT NULL,
  service_id UUID REFERENCES services(id),
  plan_owner_id UUID REFERENCES app_users(id),
  status plan_status DEFAULT 'draft',
  trigger_events TEXT,
  recovery_objectives TEXT,
  attachments JSONB,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE recovery_activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recovery_plan_id UUID REFERENCES recovery_plans(id) ON DELETE CASCADE,
  step_number INTEGER NOT NULL,
  description TEXT,
  owner_id UUID REFERENCES app_users(id),
  estimated_duration INTERVAL,
  dependencies JSONB,
  completion_status BOOLEAN DEFAULT FALSE,
  created_at timestamptz DEFAULT now()
);

-- Teams and Members
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  team_type TEXT,
  department_id UUID REFERENCES departments(id),
  description TEXT,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES app_users(id),
  designation TEXT,
  role TEXT,
  contact_number TEXT,
  alternate_contact TEXT,
  responsibilities TEXT,
  created_at timestamptz DEFAULT now()
);

-- Incident Management
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id TEXT UNIQUE,
  incident_type TEXT,
  severity severity_level,
  occurred_at timestamptz,
  reported_at timestamptz DEFAULT now(),
  service_id UUID REFERENCES services(id),
  root_cause TEXT,
  actions_taken TEXT,
  recovery_status TEXT,
  closure_report TEXT,
  status incident_status DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE incident_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id UUID REFERENCES incidents(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES app_users(id),
  note TEXT,
  created_at timestamptz DEFAULT now()
);

-- Tests and Calendar
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  test_type TEXT,
  scope TEXT,
  objectives TEXT,
  participants JSONB,
  scenario TEXT,
  scheduled_at timestamptz,
  success_criteria TEXT,
  results JSONB,
  findings JSONB,
  corrective_actions JSONB,
  status test_status DEFAULT 'planned',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE test_calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES tests(id) ON DELETE CASCADE,
  start_at timestamptz,
  end_at timestamptz,
  recurrence JSONB,
  reminder_minutes INTEGER DEFAULT 1440,
  assigned_team_id UUID REFERENCES teams(id),
  compliance_status TEXT,
  created_at timestamptz DEFAULT now()
);

-- Document Repository and Versioning
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  doc_type document_type,
  description TEXT,
  owner_id UUID REFERENCES app_users(id),
  current_version_id UUID,
  tags TEXT[],
  confidentiality_level TEXT,
  expiry_date date,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE document_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  version_number INTEGER NOT NULL,
  file_path TEXT,
  file_size BIGINT,
  checksum TEXT,
  uploaded_by UUID REFERENCES app_users(id),
  uploaded_at timestamptz DEFAULT now(),
  approval_status TEXT,
  approvals JSONB,
  changelog TEXT
);

ALTER TABLE documents ADD CONSTRAINT fk_current_version FOREIGN KEY (current_version_id) REFERENCES document_versions(id) ON DELETE SET NULL;

-- Compliance & Audit
CREATE TABLE compliance_frameworks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT UNIQUE,
  description TEXT
);

CREATE TABLE compliance_requirements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  framework_id UUID REFERENCES compliance_frameworks(id) ON DELETE CASCADE,
  requirement_key TEXT,
  description TEXT,
  owner_id UUID REFERENCES app_users(id)
);

CREATE TABLE audit_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  finding_key TEXT UNIQUE,
  title TEXT,
  description TEXT,
  requirement_id UUID REFERENCES compliance_requirements(id),
  severity severity_level,
  owner_id UUID REFERENCES app_users(id),
  status TEXT,
  remediation_plan JSONB,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Reporting / Analytics
CREATE TABLE metrics_cache (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key TEXT NOT NULL,
  payload JSONB,
  computed_at timestamptz DEFAULT now()
);

-- Notifications and Reminders
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_id UUID REFERENCES app_users(id),
  subject TEXT,
  body TEXT,
  data JSONB,
  sent_at timestamptz,
  read_at timestamptz,
  channel TEXT,
  created_at timestamptz DEFAULT now()
);

-- Exports tracking
CREATE TABLE exports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requested_by UUID REFERENCES app_users(id),
  export_type TEXT,
  parameters JSONB,
  status TEXT DEFAULT 'pending',
  file_path TEXT,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

-- Audit log
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT,
  entity_id UUID,
  actor_id UUID REFERENCES app_users(id),
  action TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at timestamptz DEFAULT now()
);

-- Versioning snapshots
CREATE TABLE entity_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id UUID,
  version_number INTEGER NOT NULL,
  data JSONB,
  created_by UUID REFERENCES app_users(id),
  created_at timestamptz DEFAULT now()
);

-- Indexes
CREATE INDEX idx_services_owner ON services(owner_id);
CREATE INDEX idx_subservices_service ON subservices(service_id);
CREATE INDEX idx_risks_owner ON risk_register(owner_id);
CREATE INDEX idx_incidents_service ON incidents(service_id);
CREATE INDEX idx_tests_scheduled_at ON tests(scheduled_at);
CREATE INDEX idx_documents_owner ON documents(owner_id);
CREATE INDEX idx_document_versions_document ON document_versions(document_id);
CREATE INDEX idx_audit_log_entity ON audit_log(entity_type, entity_id);

-- Role permissions
CREATE TABLE role_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id UUID REFERENCES roles(id) ON DELETE CASCADE,
  resource TEXT NOT NULL,
  action TEXT NOT NULL,
  field_scope TEXT
);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl TEXT;
  tbls TEXT[] := ARRAY[
    'business_units','departments','contacts','vendors','services','subservices',
    'bia_entries','risk_register','continuity_strategies','recovery_plans','teams','tests','documents','audit_findings'
  ];
BEGIN
  FOREACH tbl IN ARRAY tbls LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS set_timestamp_%s ON %s;', tbl, tbl);
    EXECUTE format('CREATE TRIGGER set_timestamp_%s BEFORE UPDATE ON %s FOR EACH ROW EXECUTE PROCEDURE trigger_set_timestamp();', tbl, tbl);
  END LOOP;
END;
$$;

-- End of migration
