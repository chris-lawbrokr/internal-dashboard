import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table/Table";

const meta: Meta<typeof Table> = {
  title: "UI/Table",
  component: Table,
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof Table>;

export const Default: Story = {
  render: () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>James Smith</TableCell>
          <TableCell>james.smith@example.com</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mary Johnson</TableCell>
          <TableCell>mary.johnson@example.com</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Robert Williams</TableCell>
          <TableCell>robert.williams@example.com</TableCell>
          <TableCell>Inactive</TableCell>
          <TableCell>Viewer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

export const WithTitle: Story = {
  render: () => (
    <Table title="Team Members">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>James Smith</TableCell>
          <TableCell>james.smith@example.com</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Admin</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Mary Johnson</TableCell>
          <TableCell>mary.johnson@example.com</TableCell>
          <TableCell>Active</TableCell>
          <TableCell>Editor</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Robert Williams</TableCell>
          <TableCell>robert.williams@example.com</TableCell>
          <TableCell>Inactive</TableCell>
          <TableCell>Viewer</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  ),
};

const SearchableTableExample = () => {
  const [search, setSearch] = useState("");

  const data = [
    { name: "James Smith", email: "james.smith@example.com", status: "Active", role: "Admin" },
    { name: "Mary Johnson", email: "mary.johnson@example.com", status: "Active", role: "Editor" },
    { name: "Robert Williams", email: "robert.williams@example.com", status: "Inactive", role: "Viewer" },
    { name: "Patricia Brown", email: "patricia.brown@example.com", status: "Pending", role: "Manager" },
    { name: "John Jones", email: "john.jones@example.com", status: "Active", role: "Analyst" },
  ];

  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    return (
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      row.role.toLowerCase().includes(q)
    );
  });

  return (
    <Table title="Users" searchValue={search} onSearchChange={setSearch} searchPlaceholder="Search users...">
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filtered.map((row) => (
          <TableRow key={row.email}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const WithSearch: Story = {
  render: () => <SearchableTableExample />,
};

const PaginatedTableExample = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 5;

  const data = Array.from({ length: 25 }, (_, i) => ({
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    status: ["Active", "Inactive", "Pending"][i % 3],
    role: ["Admin", "Editor", "Viewer", "Manager", "Analyst"][i % 5],
  }));

  const filtered = data.filter((row) => {
    const q = search.toLowerCase();
    return (
      row.name.toLowerCase().includes(q) ||
      row.email.toLowerCase().includes(q) ||
      row.status.toLowerCase().includes(q) ||
      row.role.toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize);
  const currentPage = Math.min(page, totalPages || 1);
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  return (
    <Table
      title="Users"
      searchValue={search}
      onSearchChange={handleSearchChange}
      searchPlaceholder="Search users..."
      page={currentPage}
      pageSize={pageSize}
      totalItems={filtered.length}
      totalPages={totalPages}
      onPageChange={setPage}
    >
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Role</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {paginated.map((row) => (
          <TableRow key={row.email}>
            <TableCell>{row.name}</TableCell>
            <TableCell>{row.email}</TableCell>
            <TableCell>{row.status}</TableCell>
            <TableCell>{row.role}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export const WithPagination: Story = {
  render: () => <PaginatedTableExample />,
};
