import DashboardCard from "./DashboardCard";
import QuickActionButton from "./QuickActionButton";
import { useNavigate } from "react-router-dom";

function QuickActions() {
  const navigate = useNavigate();
  
    const actions = [
      {
        label: "Add Student",
        onClick: () => navigate("/students?action=create"),
      },
      {
        label: "Add Teacher",
        onClick: () => navigate("/teachers?action=create"),
      },
      {
        label: "Create Exam",
        onClick: () => navigate("/exams/schedule"),
      },
      {
        label: "Generate Report",
        onClick: () => navigate("/dashboard"),
      },
    ];

  return (
    <DashboardCard title="Quick Actions">
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action) => (
          <QuickActionButton 
            key={action.label} 
            label={action.label} 
            onClick={action.onClick}
          />
        ))}
      </div>
    </DashboardCard>
  );
}

export default QuickActions;
