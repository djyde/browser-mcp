import { ConnectStatus } from "@/storage"
import { usePermissionsQuery, useServerStatus } from "@/utils/query"
import { useMutation } from "@tanstack/react-query"
import { version } from '../../../server/package.json'

const permissionToggles = [
  {
    key: "bookmarks",
    label: "Bookmarks",
    description: "Access to browser bookmarks",
  },
  {
    key: "history",
    label: "History",
    description: "Access to browser history",
  },
  
]

export const App = () => {
  const permissionsQuery = usePermissionsQuery()
  const serverStatus = useServerStatus()

  const statusClassName = {
    [ConnectStatus.Disconnected]: "status-error",
    [ConnectStatus.Connected]: "status-success",
    [ConnectStatus.Connecting]: "status-warning",
  }

  const permissions = permissionsQuery.data?.permissions || []

  const isEnabled = (permission: string) => {
    console.log(permission, permissions)
    return permissions.includes(permission)
  }

  const retryConnectMutation = useMutation({
    mutationFn: () => {
      return browser.runtime.sendMessage({
        type: "connect",
      })
    }
  })

  return <div className="w-[320px]">
    <div className="px-2 pt-2 mb-2 flex justify-between items-center">
      <h2 className="font-medium">Browser MCP</h2>
      <div className="text-xs text-gray-500">MPC Server Version: {version}</div>
    </div>
    <div className="">
      <div className="">
        <h3 className="bg-zinc-100 p-2">Status</h3>
        <div className="p-2 flex justify-between">
          <div className="flex items-center gap-1">
            <div className="inline-grid *:[grid-area:1/1]">
              <div className={`status ${statusClassName[serverStatus]} animate-ping`}></div>
              <div className={`status ${statusClassName[serverStatus]}`}></div>
            </div>
            {serverStatus}
          </div>

          <button type="button" onClick={() => retryConnectMutation.mutate()} className="btn btn-sm shadow-none">
            Re-connect
          </button>
        </div>
      </div>
      <div className="">
        <h3 className="bg-zinc-100 p-2">Permissions</h3>
        <div className="p-2">
          <div>
            {permissionToggles.map(toggle => {
              const checked = isEnabled(toggle.key)
              return (
                <div key={toggle.key} className="flex items-center justify-between gap-5 py-2 px-2 border-b border-gray-100 last:border-0">
                  <input type="checkbox" onChange={async e => {
                    const enabled = e.target.checked
                    if (enabled) {
                      await browser.permissions.request({
                        permissions: [
                          toggle.key as any
                        ]
                      })
                      permissionsQuery.refetch()
                    } else {
                      await browser.permissions.remove({
                        permissions: [
                          toggle.key as any
                        ]
                      })
                      permissionsQuery.refetch()
                    }
                  }} checked={checked} className="toggle toggle-sm" />
                  <div className="flex-1">
                    <div className="font-medium text-sm">{toggle.label}</div>
                    <div className="text-xs text-gray-500">{toggle.description}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>

  </div>
}
