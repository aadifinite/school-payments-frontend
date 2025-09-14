import StatusCheck from '../components/StatusCheck.jsx';
import BackendCheck from '../components/BackendCheck.jsx';

export default function StatusCheckPage() {
  return (
    <div className="space-y-4">
      <StatusCheck />
      <BackendCheck />
    </div>
  );
}
