import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { AlertCircle, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-glg-50 p-6">
      <Card className="max-w-md w-full">
        <CardContent className="pt-6 text-center">
          <div className="w-16 h-16 bg-glg-red/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="h-8 w-8 text-glg-red" />
          </div>
          <h1 className="text-4xl font-bold text-glg-900 mb-2">404</h1>
          <h2 className="text-xl font-semibold text-glg-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-glg-600 mb-6">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-glg-navy hover:bg-glg-navy-dark"
            >
              <Home className="h-4 w-4 mr-2" />
              Go to MIRA Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Go Back
            </Button>
          </div>
          <p className="text-xs text-glg-500 mt-4">Path: {location.pathname}</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;
