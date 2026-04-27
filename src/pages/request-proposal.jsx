import React from "react";
import { useRouter } from "next/router";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import RequestQuoteForm from "@/components/forms/request-quote-form";

const RequestProposalPage = () => {
  const router = useRouter();
  const selectedDevice = typeof router.query.device === "string" ? router.query.device : "";

  return (
    <Wrapper>
      <SEO pageTitle="Request Proposal" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Request Proposal" subtitle="Medical Device Proposal" bg_clr={true} />

      <section className="nees-form-page pt-80 pb-90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <RequestQuoteForm
                preselectedDevice={selectedDevice}
                sourcePage="request-proposal"
                title="Request Device Proposal"
                submitLabel="Submit Proposal Request"
                formType="device_proposal"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default RequestProposalPage;
