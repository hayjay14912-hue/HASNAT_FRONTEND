import React from "react";
import { useRouter } from "next/router";
import SEO from "@/components/seo";
import Wrapper from "@/layout/wrapper";
import HeaderTwo from "@/layout/headers/header-2";
import Footer from "@/layout/footers/footer";
import CommonBreadcrumb from "@/components/breadcrumb/common-breadcrumb";
import RequestQuoteForm from "@/components/forms/request-quote-form";

const RequestQuotePage = () => {
  const router = useRouter();
  const selectedDevice = typeof router.query.device === "string" ? router.query.device : "";

  return (
    <Wrapper>
      <SEO pageTitle="Request Quote" />
      <HeaderTwo style_2={true} />
      <CommonBreadcrumb title="Request a Quote" subtitle="Medical Device Inquiry" bg_clr={true} />

      <section className="nees-form-page pt-80 pb-90">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-8 col-lg-10">
              <RequestQuoteForm
                preselectedDevice={selectedDevice}
                sourcePage="request-quote"
                title="Request Device Pricing"
                submitLabel="Submit Quote Request"
                formType="device_quote"
              />
            </div>
          </div>
        </div>
      </section>

      <Footer primary_style={true} />
    </Wrapper>
  );
};

export default RequestQuotePage;
