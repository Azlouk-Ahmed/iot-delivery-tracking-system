import { useSocket } from '../hooks/useSocketContext'; 
import { Signal } from 'lucide-react';

function UserHome() {
  const { isConnected } = useSocket(); 
  return (
    <div className="">
      <h1 className="text-4xl font-bold mb-8">Socket.IO Learning</h1>
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${
        isConnected ? 'bg-green-600' : 'bg-red-600'
      }`}>
        <Signal className="w-5 h-5" />
        <span className="font-bold">
          {isConnected ? '🟢 CONNECTED' : '🔴 DISCONNECTED'}
        </span>
      </div>
    </div>
  );
}

export default UserHome;