import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { CHAT_API_END_POINT } from '@/constants.js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  MoreHorizontal,
  FileText,
  CheckCircle2,
  XCircle,
  Download,
  MessageCircle,
} from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';
import { APPLICATION_API_END_POINT } from '@/constants.js';
import axios from 'axios';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';

const ApplicantsTable = () => {
  const { applicants } = useSelector((store) => store.application);
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);

  const startChatWithRecruiter = async (recruiterId) => {
    try {
      await axios.post(`${CHAT_API_END_POINT}`, {
        senderId: user._id,
        receiverId: recruiterId,
      });
      navigate('/messages');
    } catch (err) {
      console.error('Failed to start chat:', err);
    }
  };

  const statusHandler = async (status, id) => {
    try {
      axios.defaults.withCredentials = true;
      const res = await axios.post(
        `${APPLICATION_API_END_POINT}/status/${id}/update`,
        { status }
      );
      if (res.data.success) {
        toast.success(`Applicant ${status.toLowerCase()} successfully`);
      } else {
        toast.error('Failed to update status');
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to update status';
      toast.error(errorMessage);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Desktop Table */}
      <div className="hidden sm:block">
        <Table>
          <TableCaption className="text-slate-500 py-4">
            {applicants?.applications?.length
              ? `Showing ${applicants.applications.length} applicants`
              : 'No applicants found'}
          </TableCaption>
          <TableHeader className="bg-slate-50">
            <TableRow>
              <TableHead>Candidate</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Resume</TableHead>
              <TableHead>Applied</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applicants?.applications?.length ? (
              applicants.applications.map((item) => (
                <TableRow key={item._id}>
                  <TableCell>
                    <div className="font-medium text-slate-800">
                      {item?.applicant?.fullname || 'N/A'}
                    </div>
                    <div className="text-sm text-slate-500">
                      {item?.applicant?.email || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>{item?.applicant?.phoneNumber || 'N/A'}</TableCell>
                  <TableCell>
                    {item?.applicant?.profile?.resume ? (
                      <Button variant="outline" size="sm" className="gap-2" asChild>
                        <a
                          href={item.applicant.profile.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Download className="h-4 w-4" />
                          {item?.applicant?.profile?.resumeOriginalName || 'Resume'}
                        </a>
                      </Button>
                    ) : (
                      <span className="text-slate-400">No resume</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDate(item?.createdAt)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        item?.status === 'Accepted'
                          ? 'bg-teal-100 text-teal-800'
                          : item?.status === 'Rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-slate-100 text-slate-800'
                      }
                    >
                      {item?.status || 'Pending'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-44 p-2 space-y-1">
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => statusHandler('Accepted', item._id)}
                        >
                          <CheckCircle2 className="mr-2 h-4 w-4 text-teal-600" />
                          Accept
                        </Button>
                        <Button
                          variant="ghost"
                          className="w-full justify-start"
                          onClick={() => statusHandler('Rejected', item._id)}
                        >
                          <XCircle className="mr-2 h-4 w-4 text-rose-600" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => startChatWithRecruiter(item?.applicant?._id)}
                          className="w-full justify-start bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:from-indigo-600 hover:to-teal-600"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Message
                        </Button>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  <FileText className="mx-auto h-8 w-8 text-slate-300" />
                  <p className="mt-2">No applicants found for this position</p>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden p-2 space-y-4">
        {applicants?.applications?.length ? (
          applicants.applications.map((item) => (
            <div
              key={item._id}
              className="border border-slate-200 rounded-lg shadow-sm p-4 space-y-3"
            >
              <div>
                <div className="font-semibold text-slate-800">
                  {item?.applicant?.fullname || 'N/A'}
                </div>
                <div className="text-xs text-slate-500">
                  {item?.applicant?.email || 'N/A'}
                </div>
              </div>
              <div className="text-sm text-slate-700">
                <strong>Phone:</strong> {item?.applicant?.phoneNumber || 'N/A'}
              </div>
              <div>
                {item?.applicant?.profile?.resume ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-2 w-full"
                    asChild
                  >
                    <a
                      href={item.applicant.profile.resume}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="h-4 w-4" />
                      {item?.applicant?.profile?.resumeOriginalName || 'Resume'}
                    </a>
                  </Button>
                ) : (
                  <span className="text-slate-400 text-sm">No resume</span>
                )}
              </div>
              <div className="text-xs text-slate-500">
                <strong>Applied:</strong> {formatDate(item?.createdAt)}
              </div>
              <div>
                <Badge
                  className={
                    item?.status === 'Accepted'
                      ? 'bg-teal-100 text-teal-800'
                      : item?.status === 'Rejected'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-slate-100 text-slate-800'
                  }
                >
                  {item?.status || 'Pending'}
                </Badge>
              </div>
              <div className="flex flex-col gap-2">
                <Button
                  size="sm"
                  onClick={() => statusHandler('Accepted', item._id)}
                  className="w-full"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4 text-teal-600" />
                  Accept
                </Button>
                <Button
                  size="sm"
                  onClick={() => statusHandler('Rejected', item._id)}
                  className="w-full"
                >
                  <XCircle className="mr-2 h-4 w-4 text-rose-600" />
                  Reject
                </Button>
                <Button
                  size="sm"
                  onClick={() => startChatWithRecruiter(item?.applicant?._id)}
                  className="w-full bg-gradient-to-r from-indigo-500 to-teal-500 text-white hover:from-indigo-600 hover:to-teal-600"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Message
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-6">
            <FileText className="mx-auto h-8 w-8 text-slate-300" />
            <p className="mt-2">No applicants found for this position</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicantsTable;
