import { useEffect } from "react";
import { connect } from "umi";

export default connect(({ breadcrumb }: { breadcrumb: Breadcrumb[] }) => ({ breadcrumb }))((props: any) => {
  useEffect(() => {
    props.dispatch({ type: 'breadcrumb/info', payload: [{ index: 1, pathname: '/404', name: '找不到页面' }] })
  }, [])
  return (
    <div className="notfound">
      <p>页面走丢了~~~</p>
      <p>检查一下访问路径吧</p>
    </div>
  );
})