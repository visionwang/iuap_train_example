import React, { Component } from 'react'
import PaginationTable from 'components/PaginationTable'
import { actions } from 'mirrorx';
import { Button,Message,Modal } from 'tinper-bee';
import moment from "moment/moment";
import Header from 'components/Header';
import OrderInfoForm from '../OrderInfo-form';
import './index.less'
export default class OrderInfoPaginationTable extends Component {
    constructor(props){
        super(props);
        let self=this;
        this.state = {
            // 表格中所选中的数据，拿到后可以去进行增删改查
            selectData: [],
            step: 10,
            showModal:false,
            delData:[],
            column:[
                {
                    title: "序号",
                    dataIndex: "index",
                    key: "index",
                    width: 200,
                    render(record, text, index) {
                        return index + 1;
                    }
                },
                    {
                        title: "订单类型",

                            dataIndex: "orderType",
                            key: "orderType",
                        width: 200,
                    },
                    {
                        title: "编号",

                            dataIndex: "orderNo",
                            key: "orderNo",
                        width: 200,
                    },
                    {
                        title: "采购单位",

                            dataIndex: "purOrgSrc",
                            key: "purOrgSrc",
                        width: 200,
                    },
                    {
                        title: "发布时间",

                            dataIndex: "releaseTime",
                            key: "releaseTime",
                        width: 200,
                    },
                    {
                        title: "订单金额",

                            dataIndex: "orderAmount",
                            key: "orderAmount",
                        width: 200,
                    },
                    {
                        title: "供应商编号",

                            dataIndex: "applyName",
                            key: "applyName",
                        width: 200,
                    },
                    {
                        title: "采购组编号",

                            dataIndex: "purGroupNo",
                            key: "purGroupNo",
                        width: 200,
                    },
                    {
                        title: "单据状态",

                            dataIndex: "billstatus",
                            key: "billstatus",
                        width: 200,
                    },
                    {
                        title: "确认时间",

                            dataIndex: "confirmTime",
                            key: "confirmTime",
                        width: 200,
                    },
                    {
                        title: "订单状态",

                            dataIndex: "orderState",
                            key: "orderState",
                        width: 200,
                    },
                {
                    title: "操作",
                    dataIndex: "d",
                    key: "d",
                    width:100,
                    fixed: "right",
                    render(text, record, index) {
                        return (
                            <div className='operation-btn'>
                                <i size='sm' className='uf uf-search edit-btn' onClick={() => { self.cellClick(record,2) }}></i>
                                <i size='sm' className='uf uf-pencil edit-btn' onClick={() => { self.cellClick(record,1) }}></i>
                                <i size='sm' className='uf uf-del del-btn' onClick={() => { self.delItem(record, index) }}></i>
                            </div>
                        )
                    }
                }
            ]
        }
    }
    componentDidMount(){
        // this.setState({ step: this.props.pageSize })
        actions.OrderInfo.loadList();//table数据
    }
    tabelSelect = (data) => {//tabel选中数据
        this.setState({
            selectData: data
        })
    }
    /**
     * 编辑,详情，增加
     */

    cellClick = async (record,btnFlag) => {
        await actions.OrderInfo.updateState({
            rowData : record,
        });

        let id = "";
        if(record){
            id = record["id"];
        }
        actions.routing.push(
            {
                pathname: 'OrderInfo-edit',
                search:`?search_id=${id}&btnFlag=${btnFlag}`
            }
        )
    }
    delItem = (record, index) => {
        this.setState({
            showModal:true,
            delData:[{ id: record.id,ts: record.ts }]
        });

    }
    onTableSelectedData = data => {

        this.setState({
            selectData: data
        })
    }
    onPageSizeSelect = (index, value) => {
        actions.OrderInfo.loadList({
            pageSize: value
        })
    }
    onPageIndexSelect = value => {
        actions.OrderInfo.loadList({
            pageIndex: value
        })
    }

    onSubmitSuc = async ()=>{
        await actions.OrderInfo.loadList();
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: '单据提交成功', color: 'success'});

    }
    // 提交操作初始执行操作
    onSubmitStart = ()=>{
        actions.OrderInfo.updateState({showLine:true});

    }
    // 提交失败回调函数
    onSubmitFail = (error)=>{
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});

    }

    // 撤回成功，失败，开始回调函数
    onRecallSuc = async ()=>{
        console.log("onRecallSuc 成功进入recall回调");
        await actions.searchTable.loadList();
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: '单据撤回成功', color: 'success'});

    }
    onRecallFail = (error)=>{
        actions.OrderInfo.updateState({showLine:false});
        Message.create({content: error.msg, color: 'danger'});

    }
    onRecallStart = ()=>{
        actions.OrderInfo.updateState({showLine:true});
    }

    //查看方法
    onExamine = async (text, record, index)=> {
        console.log("record", record);
        await actions.OrderInfo.updateState({rowData:record});
        await actions.routing.push(
            {
                pathname: 'OrderInfo-edit',
                detailObj: record,
            }
        )
    }

    onModalDel = async (delFlag)=>{
        let {delData} = this.state;
        if(delFlag){
            await actions.OrderInfo.delItem({
                param: delData
            });
        }
        this.setState({
            showModal:false,
            delData:[]
        })
    }

 

    // 清空selectData
    clearSelData = ()=>{
        this.setState({
            selectData:[]
        })
    }

    render(){
        const self=this;
        let { list, showLoading, pageIndex, pageSize, totalPages , total } = this.props;
        let {selectData,showModal} = this.state;
        console.log("list",list)
        return (
            <div className='order_info-root'>
                <Header title='请购单'/>
                <OrderInfoForm { ...this.props }/>
                <div className='table-header mt25'>
                    <Button colors="primary" style={{"marginLeft":15}} size='sm'  onClick={() => { self.cellClick({},0) }}>
                    新增
                    </Button>
                    
                </div>
                <PaginationTable
                        data={list}
                        showLoading={showLoading}
                        pageIndex={pageIndex}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        total = {total}
                        columns={this.state.column}
                        checkMinSize={6}
                        getSelectedDataFunc={this.tabelSelect}
                        onTableSelectedData={this.onTableSelectedData}
                        onPageSizeSelect={this.onPageSizeSelect}
                        onPageIndexSelect={this.onPageIndexSelect}
                        scroll={{ x: 1200, y: 500}}
                />
                <Modal
                        show={showModal}
                        onHide={this.close} >
                    <Modal.Header>
                        <Modal.Title>确认删除</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        是否删除选中内容
                    </Modal.Body>

                    <Modal.Footer>
                        <Button onClick={()=>this.onModalDel(false)} shape="border" style={{ marginRight: 50 }}>关闭</Button>
                        <Button onClick={()=>this.onModalDel(true)} colors="primary">确认</Button>
                    </Modal.Footer>
                </Modal>
            </div>

        )

    }
}