import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit, Trash2, MoreHorizontal, Building2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '@/constants.js';
import { toast } from 'sonner';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

const CompaniesTable = () => {
  const { companies, searchCompanyByText } = useSelector((store) => store.company);
  const [filteredCompanies, setFilteredCompanies] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const filtered = companies.filter((company) =>
      !searchCompanyByText
        ? true
        : company?.name?.toLowerCase().includes(searchCompanyByText.toLowerCase()) ||
          company?.location?.toLowerCase().includes(searchCompanyByText.toLowerCase())
    );
    setFilteredCompanies(filtered);
  }, [companies, searchCompanyByText]);

  const DeleteCompany = async (companyId) => {
    try {
      const res = await axios.delete(`${COMPANY_API_END_POINT}/delete/${companyId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setFilteredCompanies((prev) => prev.filter((company) => company._id !== companyId));
        toast.success('Company deleted successfully');
      } else {
        throw new Error(res.data.message || 'Failed to delete company');
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Failed to delete company');
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Desktop View */}
      <div className="hidden sm:block">
        <Table>
          <TableCaption className="text-slate-500 py-4">
            {filteredCompanies.length > 0
              ? `Showing ${filteredCompanies.length} companies`
              : 'No companies found'}
          </TableCaption>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Registered</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <TableRow key={company._id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar className="border border-slate-200">
                        <AvatarImage src={company.logo} alt={company.name} />
                        <AvatarFallback>
                          <Building2 className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-slate-800">{company.name}</div>
                        <div className="text-xs text-slate-500">{company.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{company.location || 'N/A'}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        company?.status === 'active'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-100 text-slate-800'
                      }
                    >
                      {company?.status || 'N/A'}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(company.createdAt)}</TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-40 p-2 space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => navigate(`/admin/companies/${company._id}`)}
                        >
                          <Edit className="mr-2 h-4 w-4 text-teal-600" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start text-rose-600 hover:bg-rose-50"
                          onClick={() => DeleteCompany(company._id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4 text-rose-600" />
                          Delete
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  <Building2 className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2">No companies found matching your criteria</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile View */}
      <div className="sm:hidden p-2 space-y-4">
        {filteredCompanies.length > 0 ? (
          filteredCompanies.map((company) => (
            <div
              key={company._id}
              className="border border-slate-200 rounded-lg shadow-sm p-4 space-y-3"
            >
              <div className="flex items-center gap-3">
                <Avatar className="border border-slate-200">
                  <AvatarImage src={company.logo} alt={company.name} />
                  <AvatarFallback>
                    <Building2 className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold text-slate-800">{company.name}</div>
                  <div className="text-xs text-slate-500">{company.email}</div>
                </div>
              </div>
              <div className="text-sm">
                <strong>Location:</strong> {company.location || 'N/A'}
              </div>
              <div>
                <Badge
                  className={
                    company?.status === 'active'
                      ? 'bg-teal-100 text-teal-800'
                      : 'bg-slate-100 text-slate-800'
                  }
                >
                  {company?.status || 'N/A'}
                </Badge>
              </div>
              <div className="text-xs text-slate-500">
                <strong>Registered:</strong> {formatDate(company.createdAt)}
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => navigate(`/admin/companies/${company._id}`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button
                  size="sm"
                  variant="destructive"
                  className="w-full"
                  onClick={() => DeleteCompany(company._id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-6">
            <Building2 className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2">No companies found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompaniesTable;
