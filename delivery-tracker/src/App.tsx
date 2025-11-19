import { Button } from "@/components/ui/button"
import './App.css'

function App() {

  return (
    <div className="flex min-h-svh flex-col items-center justify-center">
      <Button variant="outline">Outline</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="destructive">Destructive</Button>
<Button variant="link">Link</Button>
<Button>Link</Button>


      <h1 className="text-3xl font-bold underline">Hello world!</h1>
    </div>
  )
}

export default App
