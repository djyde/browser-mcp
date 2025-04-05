import { ConnectStatus, connectStatusStorage } from "@/storage"
import { QueryClient, useQuery } from "@tanstack/react-query"

export const queryClient = new QueryClient()

export const usePermissionsQuery = () => useQuery({
  queryKey: ["browser-permissions", "get-all"],
  queryFn: async () => {
    const permissions = await browser.permissions.getAll()
    return permissions
  },
})

export const useServerStatus = () => {
  const [status, setStatus] = useState<ConnectStatus>(ConnectStatus.Disconnected)

  async function init() {
    const initialStatus = await connectStatusStorage.getValue() ?? ConnectStatus.Disconnected
    setStatus(initialStatus)
  }

  useEffect(() => {
    init()
    const sub = connectStatusStorage.watch(value => {
      setStatus(value ?? ConnectStatus.Disconnected)
    })

    return () => {
      sub()
    }
  }, [])

  return status
}