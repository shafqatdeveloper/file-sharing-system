import React, { useMemo, useState, useEffect } from "react";
import { useTable, usePagination } from "react-table";
import {
  FaTrashAlt,
  FaEdit,
  FaEye,
  FaShare,
  FaCopy,
  FaRegCopy,
} from "react-icons/fa";
import { HiOutlineDocumentArrowUp } from "react-icons/hi2";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const Folders = () => {
  const [data, setData] = useState([]);

  const apiUrl = import.meta.env.VITE_API_URL;

  const handleShareFolder = async (folderId) => {
    const receiver = prompt("Enter Receiver Email address");
    const response = await axios.post(`/api/folder/share/${folderId}`, {
      receiver,
    });
    if (response.status === 200) {
      toast(response.data.message);
    } else {
      toast(response.data.message);
    }
  };

  const deleteFolderHandler = async (e, folderId) => {
    e.preventDefault();
    const confirmDelete = confirm(
      "Are you sure you want to delete this folder?"
    );
    if (confirmDelete) {
      try {
        const response = await axios.delete(
          `/api/admin/folder/delete/${folderId}`
        );
        if (response.status === 200) {
          toast(response.data.message);
          // Refetch the folders
          fetchData();
        } else {
          toast(response.data.message);
        }
      } catch (error) {
        if (error.response) {
          toast(error.response.data.message || "An error occurred.");
        } else if (error.request) {
          toast("No response received from the server.");
        } else {
          toast("An error occurred while setting up the request.");
        }
      }
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/admin/folders/all");
      setData(response.data.folders);
      console.log(response.data.folders[0]);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      toast("Password copied to clipboard");
    });
  };

  const columns = useMemo(
    () => [
      {
        Header: "Folder Name",
        accessor: "folderName",
      },
      {
        Header: "Admin",
        accessor: "admin.name",
      },
      {
        Header: "Profile",
        accessor: "admin.userProfilePic",
        Cell: ({ value }) => (
          <div className="flex items-center justify-center">
            <img
              src={`${apiUrl}/uploads/${value}`}
              alt="Profile"
              className="h-10 w-10 rounded-full"
            />
          </div>
        ),
      },
      {
        Header: "Password",
        accessor: "password",
        Cell: ({ value }) => (
          <div className="flex items-center">
            <span>{value}</span>
            <button
              onClick={() => copyToClipboard(value)}
              className="ml-2 text-blue-500"
            >
              <FaRegCopy />
            </button>
          </div>
        ),
      },
      {
        Header: "Actions",
        Cell: ({ row }) => (
          <div className="flex space-x-4">
            <Link
              to={`/admin/file/add/${row.original._id}`}
              className="text-green-500 hover:text-blue-700"
            >
              <HiOutlineDocumentArrowUp size={21} />
            </Link>
            <Link
              to={`/files/all/${row.original._id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEye size={21} />
            </Link>
            <Link
              to={`/admin/folder/update/${row.original._id}`}
              className="text-yellow-500 hover:text-yellow-700"
            >
              <FaEdit size={21} />
            </Link>
            <button className="text-yellow-500 hover:text-yellow-700">
              <FaShare
                onClick={() => handleShareFolder(row.original._id)}
                size={21}
              />
            </button>
            <button
              onClick={(e) => deleteFolderHandler(e, row.original._id)}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrashAlt size={21} />
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center">
      <header className="bg-white shadow-md py-4 px-6 w-full flex justify-between items-center">
        <h1 className="text-xl font-bold">All Folders</h1>
      </header>
      <main className="w-full max-w-4xl mt-10 bg-white shadow-md rounded-lg p-6">
        {data && data.length > 0 && (
          <table {...getTableProps()} className="min-w-full bg-white">
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr
                  {...headerGroup.getHeaderGroupProps()}
                  className="bg-gray-200"
                >
                  {headerGroup.headers.map((column) => (
                    <th
                      {...column.getHeaderProps()}
                      className="px-6 py-3 border-b border-gray-300 text-left text-sm leading-4 text-gray-600 uppercase tracking-wider"
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {page.map((row) => {
                prepareRow(row);
                return (
                  <tr {...row.getRowProps()}>
                    {row.cells.map((cell) => (
                      <td
                        {...cell.getCellProps()}
                        className="px-6 py-4 border-b border-gray-300 text-sm leading-5 text-gray-700"
                      >
                        {cell.render("Cell")}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        <div className="py-3 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-4 sm:mb-0 flex items-center">
            <span className="text-sm text-gray-700">
              Page <span className="font-medium">{pageIndex + 1}</span> of{" "}
              <span className="font-medium">{pageOptions.length}</span>
            </span>
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="ml-4 mt-1 sm:mt-0 block w-full pl-3 pr-10 py-2 text-base leading-6 border-gray-300 focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5"
            >
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <option key={pageSize} value={pageSize}>
                  Show {pageSize}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center justify-center">
            <nav className="relative z-0 inline-flex shadow-sm">
              <button
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              >
                <span className="sr-only">First</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10.707 14.707a1 1 0 01-1.414 0L5.707 11.414a1 1 0 010-1.414l3.586-3.586a1 1 0 011.414 1.414L8.414 10l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              >
                <span className="sr-only">Previous</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M14.707 14.707a1 1 0 01-1.414 0L10 11.414a1 1 0 010-1.414L13.293 6.414a1 1 0 011.414 1.414L12.414 10l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              >
                <span className="sr-only">Next</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M5.293 5.293a1 1 0 011.414 0L10 9.586a1 1 0 010 1.414L6.707 14.707a1 1 0 01-1.414-1.414L8.414 10 5.293 7.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
              <button
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm leading-5 font-medium text-gray-500 hover:text-gray-400 focus:z-10 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:bg-gray-100 active:text-gray-500 transition ease-in-out duration-150"
              >
                <span className="sr-only">Last</span>
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    d="M10.293 5.293a1 1 0 011.414 0L15.707 9.586a1 1 0 010 1.414L11.707 14.707a1 1 0 01-1.414-1.414L13.586 10 10.293 6.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                    fillRule="evenodd"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Folders;
