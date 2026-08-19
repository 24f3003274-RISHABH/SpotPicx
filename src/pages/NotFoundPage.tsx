import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';
import { Container } from '../components/ui/Container';
import { Button } from '../components/ui/Button';
import { ROUTES } from '../constants/routes';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="py-24 flex items-center justify-center">
      <Container size="sm" className="text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto shadow-sm">
          <Compass className="h-8 w-8 animate-spin" style={{ animationDuration: '8s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            404 Error
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Spot Not Found
          </h1>
          <p className="text-sm text-slate-500 max-w-sm mx-auto">
            The page or recommendation you're looking for isn't in our Delhi directory or has moved.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link to={ROUTES.HOME}>
            <Button variant="primary" size="md" leftIcon={<Home className="h-4 w-4" />}>
              Back to Home
            </Button>
          </Link>
          <Link to={ROUTES.EXPLORE}>
            <Button variant="outline" size="md">
              Explore Categories
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};
