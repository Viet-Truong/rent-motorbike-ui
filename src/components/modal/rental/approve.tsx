import { Motorbike } from '@/type/motorbike';
import { Modal, Table, TableColumnsType } from 'antd';

interface IApproveProps {
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  item: Motorbike[];
}

const Approve = ({ isModalOpen, setIsModalOpen, item }: IApproveProps) => {
  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const columns: TableColumnsType<Motorbike> = [
    {
      title: 'Số thứ tự',
      key: 'rental_id',
      render: (value, record, index) => {
        console.log(value, record);
        return index + 1;
      },
    },
    {
      title: 'Tên xe',
      dataIndex: 'motorbike_name',
      key: 'motorbike_name',
    },
    {
      title: 'Hãng xe',
      dataIndex: 'brand',
      key: 'brand',
    },
    {
      title: 'Biển số xe',
      dataIndex: 'motorbike_license_plates',
      key: 'motorbike_license_plates',
    },
  ];
  return (
    <div>
      <Modal
        title='Chi tiết'
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        cancelButtonProps={{ style: { display: 'none' } }}
        okText='Ok'
        maskClosable={false}
        width={1000}
      >
        <Table columns={columns} dataSource={item} rowKey={(record) => record.motorbike_id} />
      </Modal>
    </div>
  );
};

export default Approve;
