export const getFlowStatus = (cfs) => {
  if (cfs === null || cfs === undefined) return null
  if (cfs < 100)   return { status: 'too-low',  label: 'Low',       color: '#F59E0B', description: 'Wading easy, limited holding water' }
  if (cfs <= 800)  return { status: 'ideal',    label: 'Ideal',     color: '#10B981', description: 'Prime wading conditions' }
  if (cfs <= 2000) return { status: 'high',     label: 'High',      color: '#3B82F6', description: 'Elevated — use caution wading' }
  return                  { status: 'too-high', label: 'Dangerous', color: '#EF4444', description: 'Do not wade — drift boat only' }
}
