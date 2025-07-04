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
        withCredentials: true 
      });
      
      if (res.data.success) {
        setFilteredCompanies(prev => prev.filter(company => company._id !== companyId));
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
      <Table>
        <TableCaption className="text-slate-500 py-4">
          {filteredCompanies.length > 0 
            ? `Showing ${filteredCompanies.length} companies` 
            : 'No companies found'}
        </TableCaption>
        <TableHeader className="bg-slate-50">
          <TableRow>
            <TableHead className="text-slate-700 font-medium">Company</TableHead>
            <TableHead className="text-slate-700 font-medium">Location</TableHead>
            <TableHead className="text-slate-700 font-medium">Status</TableHead>
            <TableHead className="text-slate-700 font-medium">Registered</TableHead>
            <TableHead className="text-right text-slate-700 font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredCompanies.length > 0 ? (
            filteredCompanies.map((company) => (
              <TableRow key={company._id} className="hover:bg-slate-50">
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="border border-slate-200">
                      <AvatarImage 
                        src={company.logo} 
                        alt={company.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-slate-100 text-slate-600">
                        <Building2 className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium text-slate-800">{company.name}</div>
                      <div className="text-xs text-slate-500">{company.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-slate-600">
                  {company.location || 'N/A'}
                </TableCell>
                <TableCell>
                  <Badge 
                    variant={company?.status === 'active' ? 'default' : 'secondary'}
                    className={
                      company?.status === 'active' 
                        ? 'bg-teal-100 text-teal-800' 
                        : 'bg-slate-100 text-slate-800'
                    }
                  >
                    {company?.status || 'N/A'}
                  </Badge>
                </TableCell>
                <TableCell className="text-slate-500">
                  {formatDate(company.createdAt)}
                </TableCell>
                <TableCell className="text-right">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-slate-500 hover:text-teal-600"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2 space-y-1">
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-slate-700 hover:bg-slate-100"
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
              <TableCell colSpan={5} className="text-center text-slate-500 py-8">
                <Building2 className="mx-auto h-8 w-8 text-slate-300" />
                <p className="mt-2">No companies found matching your criteria</p>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CompaniesTable;