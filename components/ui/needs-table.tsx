import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Utility function for merging tailwind classes */
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NeedData = {
  id: string | number;
  solution: string;
  description: string;
  entreprise: string;
  dateCloture: string;
  contact?: string;
  coordonnees?: string;
};

interface NeedsTableProps {
  data?: NeedData[];
  className?: string;
}

export function NeedsTable({ data = [], className }: NeedsTableProps) {
  return (
    <div className={cn("w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-950", className)}>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-900 dark:text-gray-200">
            <tr>
              <th scope="col" className="px-6 py-4 font-semibold text-red-600 dark:text-red-500">
                Solutions / Services *
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-red-600 dark:text-red-500">
                Description du besoin *
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-red-600 dark:text-red-500">
                Entreprises *
              </th>
              <th scope="col" className="px-6 py-4 font-semibold text-red-600 dark:text-red-500 whitespace-nowrap">
                Date de clôture estimée *
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Contact (Noms & Prénoms)
              </th>
              <th scope="col" className="px-6 py-4 font-semibold">
                Coordonnées (Email, Téléphone)
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-800">
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={row.id || idx} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-gray-100">{row.solution}</td>
                  <td className="px-6 py-4 max-w-xs truncate" title={row.description}>{row.description}</td>
                  <td className="px-6 py-4">{row.entreprise}</td>
                  <td className="px-6 py-4">{row.dateCloture}</td>
                  <td className="px-6 py-4">{row.contact || '-'}</td>
                  <td className="px-6 py-4">{row.coordonnees || '-'}</td>
                </tr>
              ))
            ) : (
              // Empty state rows to match the image structure
              Array.from({ length: 3 }).map((_, idx) => (
                <tr key={idx} className="hover:bg-gray-50/50 transition-colors dark:hover:bg-gray-900/50">
                  <td className="px-6 py-4"><div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-full rounded bg-gray-100 dark:bg-gray-800 animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-2/3 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-1/2 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-3/4 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"></div></td>
                  <td className="px-6 py-4"><div className="h-4 w-5/6 rounded bg-gray-100 dark:bg-gray-800 animate-pulse"></div></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="bg-gray-50 px-6 py-4 text-xs text-gray-500 border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-400">
        <p className="flex items-center gap-2 mb-1">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          En rouge : Champs obligatoires (*)
        </p>
        <p className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gray-500 dark:bg-gray-400"></span>
          En noir : Champs facultatifs
        </p>
      </div>
    </div>
  );
}
